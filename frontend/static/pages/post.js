export default class {
    constructor(params) {
        this.params = params;
    }

    render () {
        return `
            <h1>Posts</h1>
            <p>You are viewing the posts! ${this.params?.id} ${this.params?.number}</p>
        `;
    }
}