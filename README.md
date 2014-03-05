Grapher.js
==========

Grapher is a simple Javascript library built for displaying relationship based information. It makes use of the great drawing library, [Raphael](http://raphaeljs.com "Raphael").

There are function reference inline comments inside the grapher.js file. I'd recommend you review the [Raphael documentation](http://raphaeljs.com/reference.html "Raphael Docs") before attempting to use this library.

Grapher.js is written by [James Kirsop](http://www.jameskirsop.com "James Kirsop") to fill a desire to learn more about Javascript and a need for a free graphing library for my regular job. You can contact me via james.kirsop@gmail.com. I have plans to open source the library in the future, but at the moment I've not decided on a license. Thanks to [Daraco IT Services](http://www.daraco.com.au "Daraco IT Services") for letting me work on this for client projects and contribute back the changes.

### Useage

The 'Tests' folder contains a simple HTML file as an example of how one might use the library. It also serves as the tool used to ensure the various charts etc. are rendering correctly.

#### Bar Charts
You can add a Bar Chart to a Raphael Paper object by calling drawBarChart(options). The options object may contain the following:
-	containerWidth - Width of the bar chart you'd like to draw
-	containerHeight - Height of the bar chart you'd like to draw
-	gutter - how much space you'd like between the container and your axis (default is 20)
- maxValue - If your data has a maximum value that you'd like to set for the vertical axis, you can define it here. If you don't specify it the largest value found in the values array will be used.
-	values - an array of objects containing the following:
	- name - A description of the value
	- value - The value its self
	- color - The fill colour, in hexadecimal notation (with no leading #), you'd like the bar to have. If this isn't defined, one will be assigned for you.