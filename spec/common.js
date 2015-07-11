function login(username, password, next) {
    request(app)
        .post('/session/login')
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