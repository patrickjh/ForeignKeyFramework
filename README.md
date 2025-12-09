This is my custom Javascript Framework I've been working on for a bit.

The idea is similar to a ForeignKey in a database.

When some state changes in the browser, the elements with a foreign key linking them to that change react.

I use an html attribute foreignkeys="" to connect elements to state that might change.

When pieces of state change, the framework searches for elements with matching foreignkeys="" and emits a ForeignKeyEvent on those elements.

The elements can then add event listeners for a 'foreignkey' event to react to the change.

I use this with custom elements, but you can also use it with server rendered vanilla HTML so long as you can set the foreignkeys="" attribute.

foreignkeys="" works similar to class="" in that there are space separated tokens. Each token is a url of a type of state that might change.

Currently the types of state that can be used are: url: input: click: store:

store: is the most interesting one as it uses a ForeignKeyStore abstraction where you can get and set key / value pieces of data and have the UX react to updates.

url: just lets you react to changes in the url

input: lets you react when another element receives input.

click: letse you react when another element is clicked.

There are also a few custom elements that use these in useful ways.

<foreign-key-page> uses the url: scheme to watch the url hash.

When the url hash matches the hash="" on the <foreign-key-page> the "page" is shown.

This enables natural forward and back navigation between "pages" based on the hash.

This also lets you use normal <a href="#whatever"> elements to jump between "pages" in a single page app.

<foreign-key-list> creates a list that creates one custom element for each piece of data liked via the foreign key.

This likely still needs some work

This framework is still a work in progress.

I don't really have time to make it awesome, but hopefully someone else can take the ideas and run with them to make a framework that's better.
