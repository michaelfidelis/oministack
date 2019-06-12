const Post = require('../models/Post');

module.exports = {
  async store(request, response) {
    try {
      const { id } = request.params;
      const post = await Post.findById(id);

      post.likes += 1;

      await post.save();

      request.io.emit('like', post);
      
      return response.json(post);
    } catch (error) {
      return response.status(500).send({message: 'Erro ao atualizar likes do post!', error: error.message})
    }
  },
};