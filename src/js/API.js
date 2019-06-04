class API {
    constructor(url) {
        this.url = url;
        this.conf = {};
    }

    async loadAll() {
        this.conf.method = 'GET';
        this.conf.mode = 'cors';

        try {
            const load = await fetch(this.url, this.conf);
            const data = await load.json();

            this.conf = {};
            return data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async loadOne(id) {
        this.conf.method = 'GET';
        this.conf.mode = 'cors';

        try {
            const load = await fetch(`${this.url}/${id}`, this.conf);
            const data = await load.json();

            this.conf = {};
            return data;
        } catch (e) {
            throw new Error(e);
        }
    }

    async add(body, cb = () => {}) {
        try {
            this.conf.method = 'POST';
            this.conf.mode = 'cors';
            this.conf.body = JSON.stringify(body);

            const load = await fetch(this.url, this.conf);
            const data = await load.json();

            this.conf = {};
            return cb(data);
        } catch (e) {
            throw new Error(e);
        }
    }

    async update(body, cb = () => {}) {
        try {
            this.conf.method = 'PUT';
            this.conf.mode = 'cors';
            this.conf.body = JSON.stringify(body);

            const load = await fetch(this.url, this.conf);
            const data = await load.json();

            this.conf = {};
            return cb(data);
        } catch (e) {
            throw new Error(e);
        }
    }

    async editStatus(id, cb = () => {}) {
        try {
            this.conf.method = 'PATCH';
            this.conf.mode = 'cors';

            const patch = await fetch(`${this.url}/${id}`, this.conf);
            const data = await patch.json();

            this.conf = {};
            return cb(data);
        } catch (e) {
            throw new Error(e);
        }
    }

    async delete(id, cb = () => {}) {
        try {
            this.conf.method = 'DELETE';
            this.conf.mode = 'cors';

            const del = await fetch(`${this.url}/${id}`, this.conf);
            const data = await del.json();

            this.conf = {};
            return cb(data);
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default API;
