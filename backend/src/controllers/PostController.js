const Post = require('../models/Post');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {
  async index(request, response) {
    try {
      const posts = await Post.find().sort('-createdAt');
      return response.json(posts);
    } catch (error) {
      return response.status(500).send({message: 'Erro ao obter posts!', error: error.message})
    }
  },

  async store(request, response) {
    try {
      const { author, place, description, hashtags} = request.body;
      const { filename: image } = request.file;

      const [name] = image.split('.');
      const filename = `${name}.jpg`;

      await sharp(request.file.path)
        .resize(500)
        .jpeg({quality: 70})
        .toFile(path.resolve(request.file.destination, 'resized', filename));

      fs.unlinkSync(request.file.path);

      const post = await Post.create({
        author,
        place,
        description,
        hashtags,
        image: filename
      });

      request.io.emit('post', post);
      return response.json(post);
    } catch (error) {
      return response.status(500).send({message: 'Erro ao criar post!', error: error.message})
    }
  },
};