module.exports = {
    db: {
        postgres: {},
        orient: {},
    },
    test: [
        'create_comment_tree',
        'select_child_messages',
        'select_descendant_messages',
        'select_messages_greater',
    ],
	thread: {
		count: 100,
	},
	comment: {
		branch: {
			count: 10,
			depth: 100,
		},
	},
}