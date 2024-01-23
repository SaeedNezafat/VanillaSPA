export default class {
    render () {
        return `
        <h2>About Page</h2><p>This is About Page.</p>
        <h1>پایین باید یک چایلد رندر بشه</h1>
                  <router-view></router-view>
           ${console.log('rendered')}

        `;
    }
}