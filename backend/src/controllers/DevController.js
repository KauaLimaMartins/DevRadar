const axios = require('axios');
const Dev = require('../models/dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

/*index, show, store, update, destroy 
    ---
Mostrar uma lista desse recurso: Index
Mostart um único: show
Criar: store
Mudar: update
Deletar: Destroy
*/

module.exports = {
    async index(request, response) {
        const devs = await Dev.find()

        return response.json(devs);
    },
    
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
            
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            // Filtrar as Conexões, e que o novo dev tenha pelo menos uma das tecnologias filtradas
          
            const sendSocketMessageTo = findConnections(
              { latitude, longitude },
              techsArray,
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
          };

        return response.json(dev);
    },

    async destroy(request, response) {
        console.log(request.params);

        const { github_username } = request.params;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            return response.status(400).json({ message: 'Usuario não encontrado' });
        }
        
       await Dev.findOneAndDelete({ github_username });

        return response.json({ message: 'usuario deletado' });
    }
};