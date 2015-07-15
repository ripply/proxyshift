module.exports = {

    auth: {

        'group member group owner': function (req, act) { // owner/member
            // check if the user has access to this group
            // the user will be a part of the group
            // or own the group
            // select groups.* from groups inner join usergroups
            //   on groups.id = usergroups.group_id and usergroups.user_id = 3
            //   union select * from groups where user_id = 3;
            var group_id = req.params.id;
            var user_id = req.user.id;
            return models.Group.query(function (q) {
                q.select('groups.*').innerJoin('usergroups', function () {
                    this.on('groups.id', '=', 'usergroups.group_id')
                        .andOn('usergroups.user_id', '=', user_id);
                })
                    .where('groups.id', '=', group_id)
                    .union(function () {
                        this.select('groups.*')
                            .from('groups')
                            .where('user_id', '=', user_id)
                            .andWhere('id', '=', group_id);
                    });
            })
                .fetch({require: true})
                .then(function (group) {
                    return true;
                })
                .catch(function (err) {
                    return false;
                });
        }

    }

};
