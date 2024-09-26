import Fastify from "fastify";
const fastify = Fastify({
  logger:true,
})

fastify.get('/data', async function(req,res){

})

fastify.listen(
  {
    port:3333,
    host:'localhost'
  }
)