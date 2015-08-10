function login(username, password, next) {
    try {
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
    } catch (err) {
        next(err);
    }
}

function failToLogin(username, password, code, next) {
    try {
        expect(global.sess).to.not.be.undefined;
        global.sess.post('/session/login')
            .set('Accept', 'application/json')
            .send({
                username: username,
                password: password
            })
            .expect(code)
            .end(next);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    login: login
};
