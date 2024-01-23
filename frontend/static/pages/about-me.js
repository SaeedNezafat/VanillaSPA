export default class {
    constructor(params) {
        this.params = params;
    }

    render () {
        return `
            <h1>About Me</h1>
            <p>You are viewing the About Me!</p>
            <router-view></router-view>
            <h1>بالا باید کامپوننت چایلد رندر بشه</h1>
        `;
    }
}