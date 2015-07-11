function login(username, password, next) {
    expect(global.sess).to.not.be.undefined;
    global.sess.post('/session/login')
        .set('Accept', 'application/json')
        .send({
            username: username,
            password: password
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(next);
}

module.exports = {
    login: login
};
