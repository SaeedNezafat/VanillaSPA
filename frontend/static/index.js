import { useRouter } from "./router/router.js";

const router = useRouter();

const handleClick = () => {
    router.push('/posts/:id/router/:number', {
        query: {
          count: 22
        },
        params: {
            id: 12,
            number: 26
        }
    })
}

const handleClickDiffParam = () => {
    router.push('/posts/:id/router/:number', {
        query: {
            count: 25
        },
        params: {
            id: 26,
            number: 35
        }
    })
}

const handleClickReplcae = () => {
    // router.push('/posts/126/router/22')
    // router.back(1)
}

document.getElementById('param').addEventListener('click', handleClick);
document.getElementById('diffparams').addEventListener('click', handleClickDiffParam);