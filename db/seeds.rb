# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# TODO: Check into using Fixtures for these maybe? (not 100% sure what fixtures are)
# User account types
Type.create(name: 'Admin', admin: true, not_deletable: true)
Type.create(name: 'User', admin: false, not_deletable: false)

root = Category.create(name: 'root', parent_id: nil, root: true)
districts = Category.create(name: 'districts', parent_id: root.id, root: false)
regions = Category.create(name: 'regions', parent_id: districts.id, root: false)
districts_two = Category.create(name: 'districts_two', parent_id: root.id, root: false)

now = DateTime.now
later = now + 1.days
Shift.create(start: now, end: later)