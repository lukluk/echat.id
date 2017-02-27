var request = require("request")
var expect = require('expect.js');
const HOST = "http://localhost:3000"
const target = "jali"
describe('chat', function() {
  // describe('get history',function(){
  //   it("should give you yanto chat history's without error", function(done) {
  //         request(HOST+"/chat?user="+target,function(err,req,body){
  //
  //            if(err) throw new Error('Cannot access API');
  //            history = JSON.parse(body)
  //            console.log(history)
  //            expect(Object.keys(history).length>0).to.be(true)
  //            done()
  //         })
  //   });
  // })
<<<<<<< HEAD
  describe('open window',function(){
    // it("should open jali window",function(done){
    //   this.timeout(30000000);
    //   request(HOST+'/open?user=jali',function(err,req,body){
    //       if(err) throw new Error('Cannot access API')
    //       status = JSON.parse(body)
    //       expect(status).to.have.property("success")
    //       done()
    //   })
    // })
    // it("should open Emil Livaza window",function(done){
    //   this.timeout(30000000);
    //   request(HOST+'/open?user=Emil Livaza',function(err,req,body){
    //       if(err) throw new Error('Cannot access API')
    //       status = JSON.parse(body)
    //       expect(status).to.have.property("success")
    //       done()
    //   })
    // })
    it("should open Jali window",function(done){
      this.timeout(30000000);
      request(HOST+'/open?user=Jali',function(err,req,body){
=======
   describe('open window',function(){
     it("should open 62818667898 window",function(done){
       this.timeout(30000000);
       request(HOST+'/open?user=62818667898',function(err,req,body){
           if(err) throw new Error('Cannot access API')
           status = JSON.parse(body)
           expect(status).to.have.property("success")
           done()
       })
     })
   })
/*
  describe('basic', function() {
    this.timeout(20000);
    it("should send msg to 6281296286864",function(done){
      quotes =['Persiapkan hari ini untuk keinginan hari esok -Aesop','Kesenangan dalam sebuah pekerjaan membuat kesempurnaan pada hasil yang dicapai','Anda harus melalui hari ini dengan irama. Biarkan seluruh kehidupanmu berirama seperti lagu','Abdurahman Wahid: Jangan pernah berkata “mungkin”']
      request(HOST+'/sendmsg?user=6281296286864&msg='+quotes[Math.floor(Math.random(1)*(quotes.length-1))],function(err,req,body){
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
          if(err) throw new Error('Cannot access API')
          status = JSON.parse(body)
          expect(status).to.have.property("success")
          done()
      })
    })
<<<<<<< HEAD
    it("should open Titus window",function(done){
      this.timeout(30000000);
      request(HOST+'/open?user=Titus',function(err,req,body){
          if(err) throw new Error('Cannot access API')
          status = JSON.parse(body)
          expect(status).to.have.property("success")
          done()
      })
    })
  })
  // describe('basic', function() {
  //   this.timeout(20000);
  //   it("should send msg to 6281296286864",function(done){
  //     quotes =['Persiapkan hari ini untuk keinginan hari esok -Aesop','Kesenangan dalam sebuah pekerjaan membuat kesempurnaan pada hasil yang dicapai','Anda harus melalui hari ini dengan irama. Biarkan seluruh kehidupanmu berirama seperti lagu','Abdurahman Wahid: Jangan pernah berkata “mungkin”']
  //     request(HOST+'/sendmsg?user=6281296286864&msg='+quotes[Math.floor(Math.random(1)*(quotes.length-1))],function(err,req,body){
  //         if(err) throw new Error('Cannot access API')
  //         status = JSON.parse(body)
  //         expect(status).to.have.property("success")
  //         done()
  //     })
  //   })
  // });
=======
  });
*/
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
});
