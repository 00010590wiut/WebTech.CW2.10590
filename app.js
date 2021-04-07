//Calling the modules
const express = require('express')
const app = express()
const fs = require('fs')

//setting the view engine, we are using pug template 
app.set('view engine', 'pug')

//defining the database
const db = './data/histories.json' 

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))


//the url "/" will read the pug page home where the histories list is sent as an object
app.get('/', (req, res) => {

	fs.readFile(db, (err, data) => {
		if (err) throw err

		const histories = JSON.parse(data)

		res.render('home', { historiesList: histories.length == 0 ? false : histories })
	})
})


//when '/create-history' url is accessed express renders the pug file 'create-history
app.get('/create-history', (req, res) => {
	res.render('create-history')
})

//post method is done when in url "/create-history"
app.post('/create-history', (req, res) => {
	const title = req.body.title_of_history
	const description = req.body.description
	const text = req.body.text
// some validation for user input
	if (title.trim() !== '' && description.trim() !== '' && text.trim() !== '') {
		
		fs.readFile(db, (err, data) => {
			if (err) throw err

			const histories = JSON.parse(data)

			histories.push({
				id: id(),
				title: title,
				description: description,
				text: text
			})
//writing the user input into the json file using the method from fs
			fs.writeFile(db, JSON.stringify(histories), err => {
				if (err) throw err

				res.render('create-history', { success: true })
			})

		})

	} else {
		res.render('create-history', { error: true })
	}	
})

//basic REST api

//when the '/api/v1/histories' is accessed the json file with the data inside will be shown 
app.get('/api/v1/histories', (req, res) => {

	fs.readFile(db, (err, data) => {
		if (err) throw err

		const histories = JSON.parse(data)

		res.json(histories)
	})
})

//when the url '/all-histories' accessed the express renders the 'all-hstories' pug file with the data sent as list
app.get('/all-histories', (req, res) => {

	fs.readFile(db, (err, data) => {
		if (err) throw err

		const histories = JSON.parse(data)

		res.render('all-histories', { historiesList: histories.length == 0 ? false : histories })
	})
})

//when the id of the 'history' is clicked the express will render the 'detail' pug file with the history of the corresponding id
app.get('/all-histories/:id', (req, res) => {

	const id = req.params.id

	fs.readFile(db, (err, data) => {
		if (err) throw err

		const histories = JSON.parse(data)

		const history = histories.filter(history => history.id == id)[0]
	
        res.render('detail', { historyDetail: history })		
	})
})


//the logic is the same but the selected id will be deleted and the new list then will be rendered
app.get('/all-histories/:id/delete', (req, res) => {
	const id = req.params.id

	fs.readFile(db, (err, data) => {
		if (err) throw err

		const histories = JSON.parse(data)

		const filteredHistories = histories.filter(history => history.id != id)

		fs.writeFile(db, JSON.stringify(filteredHistories), err => {
			if (err) throw err

			res.render('all-histories', { historiesList: filteredHistories, deletedHistory: id })
		})
	})
})

//the logic of the two folloing methods are the same as above but for 'home' pug file
app.get('/home/:id', (req, res) => {

	const id = req.params.id

	fs.readFile(db, (err, data) => {
		if (err) throw err

		const histories = JSON.parse(data)

		const history = histories.filter(history => history.id == id)[0]
	
        res.render('detail', { historyDetail: history })		
	})
})
app.get('/about', (req, res) => {
	res.render('about')
})

//the port the application is hosted
app.listen(8000, err => {
	if(err) throw err

	console.log('App is running on port 8000...')
})

//function for generating the random id
function id () {
  return '_' + Math.random().toString(36).substr(2, 9);
}