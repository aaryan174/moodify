const ImageKit = require("@imagekit/nodejs")

const client = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
});


async function uploadFile({buffer, filename, folder=""}) {
    const file = await clint
}