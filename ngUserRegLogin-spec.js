require ('util')
'use strict';
var loginpage = require(__dirname+'\\page-objects\\login.pageObject.js');
var registerpage = require(__dirname+'\\page-objects\\register.pageObject.js');
var logoutpage = require(__dirname+'\\page-objects\\logout.pageObject.js');
describe('AngularJS', function() {
  var autoGenerateUserName = function() {
       var autoGenerateUserName = "";
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
       for (var i = 0; i < 3; i++)
           autoGenerateUserName += possible.charAt(Math.floor(Math.random() * possible.length));
       return  autoGenerateUserName;
   };
  var randVal = autoGenerateUserName();
  var start = new Date().getTime();

 beforeEach(function() {
   //browser.waitForAngular();
   browser.refresh();
 });

 it('to check the page title', function() {
   browser.driver.getTitle().then(function(text){console.log(text);});
   expect(browser.getTitle()).toEqual('AngularJS User Registration and Login Example');
 });

 it('should navigate to the login page upon opening the application in browser', function () {
     browser.executeAsyncScript(
       'window.setTimeout(arguments[arguments.length - 1], 500);'
     ).then(function() {
        console.log(
            'Elapsed time on login page: ' + (new Date().getTime() - start) + ' ms');
      });
     browser.driver.getCurrentUrl().then(function(text){console.log(text);});
     expect(browser.getCurrentUrl()).toContain('/login','Login page opened');
 });

 it('should navigate to the register page when the register button is clicked', function () {
   loginpage.clickRegisterBtn();
   browser.driver.wait(
     function() {
       return browser.driver.getCurrentUrl().then
       (function(url)
       {
           return (/register/).test(url);
       });
     });
     browser.driver.getCurrentUrl().then(function(text){console.log(text);});
     expect(browser.getCurrentUrl()).toContain('/register', 'Registration page opened');
 });

 it('should register user', function() {
   registerpage.enterFirstName('Vivek');
   registerpage.getFirstName().then(function(text) {
       console.log("Got firstname: "+text);
       browser.params.firstname = text;
     expect(text).toContain('Vivek');
  });

   registerpage.enterLastName('Kumar');
   registerpage.getLastName().then(function(text) {
      console.log("Got lastname: "+text);
    expect(text).toContain('Kumar');
 });

   registerpage.enterUserName('vkumar_'+randVal);
   registerpage.getUserName().then(function(text) {
      console.log("Got username: "+text);
      browser.params.username = text;
      expect(text).toContain('vkumar_'+randVal);
    });

 registerpage.enterPassWord('P@ssw0rd');
 registerpage.getPassWord().then(function(text) {
    console.log("Got password: "+text);
    browser.params.password = text;
  expect(text).toContain('P@ssw0rd');
});

  //Click on Register button
   registerpage.clickRegBtn();

   //Wait for the current URL to change to welcome
   browser.driver.wait(
     function() {
       return browser.driver.getCurrentUrl().then
       (function(url)
       {
           return (/login/).test(url);
       });
     });

   expect(browser.getCurrentUrl()).toContain('http://localhost:8081/#!/login');
});

it('should login registered user', function() {
  browser.executeAsyncScript('window.setTimeout(arguments[arguments.length - 1], 500);').
   then(function() {
     console.log(
         'Elapsed time: ' + (new Date().getTime() - start) + ' ms');
   });
   loginpage.enterUsername(browser.params.username);
   expect(loginpage.getUsername()).toContain('vkumar_'+randVal);

   loginpage.enterPassword(browser.params.password);
   expect(loginpage.getPassword()).toContain('P@ssw0rd');

   loginpage.clickLoginBtn();

   expect(browser.getCurrentUrl()).toContain('http://localhost:8081/#!');
});

   it('logout the logged in user', function(){
   logoutpage.homePageHeader().getText().then(function(text) {
  console.log("Homepage validation "+text);
  expect(text).toContain('You\'re logged in!!');
    });
   logoutpage.clickLogoutBtn();
 });
});
