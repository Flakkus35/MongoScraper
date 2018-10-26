# MongoScraper

Check it out here: https://mongo-scrap.herokuapp.com/

App scrapes current articles from the New York Times website to generate that information onto the site using handlebars.

Once scraped, the app stores the headline, summary, and link to the page in a Mongo database.

# To Begin

To begin hit the 'Scrape' button on the top of the screen to find new articles. Articles will show up once the scrape has been completed.

Hitting the 'Check out the article' link will send you to the page linked to on the New York Times webpage.

Hitting the 'Save Article' button will save the article to your saved articles and store that info in Mongo.

Hitting the 'Notes' button on any page will open up the notes modal.

# Saved Articles Page

Clicking the 'Saved' button at the top will take you to the saved articles page which will display all articles you have saved.

Clicking the 'Delete Article' button will remove the article from saved, update the Mongo database, then refresh the page.

Articles will keep there notes with them when they are added or deleted from the saved articles list.

# Notes

Once you hit the 'Notes' button on either the main page or the saved articles page the notes modal will open.

The modal will show any notes you currently have on the article, if any, and give you the option to add one.

To add a note simply input your note into the form field then hit the 'Add note' button.

That note is now saved to the article and will not disappear when the article is deleted to or added to the saved articles list.

Clicking the 'Delete' button while in the Note modal will delete the note from the article permanently.
