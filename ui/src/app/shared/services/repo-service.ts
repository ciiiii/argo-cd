import * as models from '../models';
import requests from './requests';

export class RepositoriesService {
    public list(): Promise<models.Repository[]> {
        return requests.get('/repositories').then((res) => res.body as models.RepositoryList).then((list) => list.items || []);
    }

    public createHTTPS({type, name, url, username, password, tlsClientCertData, tlsClientCertKey, insecure, enableLfs}:
        {type: string, name: string, url: string, username: string, password: string, tlsClientCertData: string, tlsClientCertKey: string,
            insecure: boolean, enableLfs: boolean}): Promise<models.Repository> {
        return requests.post('/repositories').send({type, name, repo: url, username, password, tlsClientCertData, tlsClientCertKey, insecure, enableLfs })
            .then((res) => res.body as models.Repository);
    }

    public createSSH({type, name, url, sshPrivateKey, insecure, enableLfs}:
        {type: string, name: string, url: string, sshPrivateKey: string, insecure: boolean, enableLfs: boolean}): Promise<models.Repository> {
        return requests.post('/repositories').send({ type, name, repo: url, sshPrivateKey, insecure, enableLfs }).then((res) => res.body as models.Repository);
    }

    public delete(url: string): Promise<models.Repository> {
        return requests.delete(`/repositories/${encodeURIComponent(url)}`).send().then((res) => res.body as models.Repository);
    }

    public apps(repo: string, revision: string): Promise<models.AppInfo[]> {
        return requests.get(`/repositories/${encodeURIComponent(repo)}/apps`).query({revision})
            .then((res) => res.body.items as models.AppInfo[] || []);
    }

    public charts(repo: string): Promise<models.HelmChart[]> {
        return requests.get(`/repositories/${encodeURIComponent(repo)}/helmcharts`)
            .then((res) => (res.body.items as models.HelmChart[] || []));
    }

    public appDetails(source: models.ApplicationSource): Promise<models.RepoAppDetails> {
        return requests.post(`/repositories/${encodeURIComponent(source.repoURL)}/appdetails`).send({source})
            .then((res) => res.body as models.RepoAppDetails);
    }
}
