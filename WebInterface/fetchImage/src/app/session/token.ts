import { observable, action } from 'mobx';

class TokenStore {
    @observable token: string | null = null;

    @action getToken() {
        return this.token;
    }
    
    @action setToken(token: string) {
        this.token = token;
    }

    @action clearToken() {
        this.token = null;
    }
}

export default new TokenStore();