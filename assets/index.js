let randNum = Math.random() * (3000 - 1000) + 1000

setTimeout(() => {
    location.assign(`${location.origin}/search`);
}, randNum);