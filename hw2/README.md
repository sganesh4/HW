## Test Generation

The goal of this work shop is to learn use a combination of mocking, random testing, and feedback-directed testing to automatically increase testing coverage. This is a powerful technique that can automatically discover bugs in new commits deployed to a build server before hitting production or affecting canary servers.

    git clone https://github.com/CSC-DevOps/TestGeneration.git
    cd TestGeneration
    npm install

Directory Contents:

* **main.js**: Main code driving constraint discovering and test case generation.
* **subject.js**: This is the code we are testing. It contains some simple code with operations on strings, integers, files, and phone numbers.
* **test.js**: This is an automatically created test script. Running `node main.js` will create a new `test.js`.

### Code Coverage

Code coverage can be an effective way to measure how well tested a code system is. To see code coverage in action, we will run `istanbul` on our "test suite", represented by 'test.js'.

##### Getting a simple coverage report

[Useful resource](http://ariya.ofilabs.com/2012/12/javascript-code-coverage-with-istanbul.html) for istanbul.

You can run the local version as follows:

    node_modules/.bin/istanbul cover test.js
    node_modules\.bin\istanbul cover test.js (Windows)

To install istanbul globally, saving some keystrokes, you can do the following:

    npm install istanbul -G

You'll get a high level report as follows (a more detailed report will be stored in `coverage/`):
<pre>
=============================== Coverage summary ===============================

Statements   : 80% ( 4/5 )
Branches     : 50% ( 1/2 )
Functions    : 100% ( 1/1 )
Lines        : 100% ( 4/4 )
================================================================================
</pre>

##### See a fully annotated html report here:
    
    open coverage/lcov-report/TestGeneration/subject.js.html
    start coverage/lcov-report/TestGeneration/subject.js.html (Windows)

Coverage Report for Local Machine run
![Alt text](https://raw.githubusercontent.com/sganesh4/HW/master/hw2/coverage_html.png)
