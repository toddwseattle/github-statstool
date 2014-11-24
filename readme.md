# github-stats
This is a simple github stats tool I developed to help in evaluating student participation in github projects.

currently it lists all the github repositories under the user 

# usage

node app.js -u [github user] -p [github password] <options>

options:

-a the default list all repositories for the user and (optionally) organization
-o [github org]

organization to list repositories from.  will list private repositories if user has permission.


# app structure
github-stats is built as a simple node.js command line tool.  

the command line app itself is contained in app.js

Two main npm libraries are used to construct the tool:

- github a node oriented javascript api to github.com see here: [http://mikedeboer.github.com/node-github/](http://mikedeboer.github.com/node-github/)
- yargs a great libray for parsing command line options: [http://github.com/chevex/yargs](http://github.com/chevex/yargs)

# tests
no tests yet!
