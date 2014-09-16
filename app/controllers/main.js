/*
 * PayPal Classic Auth Example
 * NodeJS API Client Example for PayPal Classic API's Account Authentication Service
 *
 * Copyright 2014 Maria Mora
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var qs = require('qs')
  , request = require('request')
  , merchantApiEndpoint = geddy.config.merchantApiEndpoint
  , paypalRedirectUrl = geddy.config.paypalRedirectUrl
  , callbackUrl = geddy.config.fullHostname + '/auth/paypal/callback';

var Main = function () {

  /*
   * Main Page. Shows User Info when session is active.
   */
  this.index = function (req, resp, params) {
    var self = this;
    
    self.respond({params: params, userInfo: self.session.get('userInfo')}, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };
  
  /*
   * Account Authentication Service
   * Handles access token retrieval and redirection to PayPal Auth
   */
  this.paypalAuth = function (req, resp, params) {
    var self = this;
    
    var paypalParams = {
      METHOD: 'SetAuthFlowParam'
    , VERSION: '117.0'
    , USER: geddy.config.paypal.user
    , PWD: geddy.config.paypal.pwd
    , SIGNATURE: geddy.config.paypal.signature
    , returnUrl: geddy.config.fullHostname + '/auth/paypal/callback'
    , cancelUrl: geddy.config.fullHostname + '/'
    , logoutUrl: geddy.config.fullHostname + '/'
    , SERVICENAME1: 'Name'
    , SERVICEDEFREQ1: 'Required'
    , SERVICENAME2: 'Email'
    , SERVICEDEFREQ2: 'Required'
    };
    
    // API Call to retrieve access token from PayPal
    request.post({
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: merchantApiEndpoint,
      body: qs.stringify(paypalParams)
    }, function(err, res, body) {
      if (err) {
        geddy.log.error(JSON.stringify(err));
        throw new InternalServerError();
      }
      
      body = qs.parse(body);
      
      if (!body.TOKEN) {
        throw new Error(JSON.stringify(body));
      }
      
      // Build PayPal Authorization URL
      var requestParams = {
        cmd: '_account-authenticate-login'
      , token: body.TOKEN
      };
      var paypalAuthorizationUrl = paypalRedirectUrl + '?' + qs.stringify(requestParams);
      
      // Redirect to PayPal for authorization
      self.redirect(paypalAuthorizationUrl);
    });
  };
  
  /* 
   * Callback from PayPal Auth, retrieve customer data
   */
  this.paypalAuthCallback = function (req, resp, params) {
    var self = this;
    
    var paypalParams = {
      METHOD: 'GetAuthDetails'
    , VERSION: '117.0'
    , USER: geddy.config.paypal.user
    , PWD: geddy.config.paypal.pwd
    , SIGNATURE: geddy.config.paypal.signature
    , token: params.token
    };
    
    // API Call to retrieve user information
    request.post({
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      url: merchantApiEndpoint,
      body: qs.stringify(paypalParams)
    }, function(err, res, body) {
      if (err) {
        geddy.log.error(JSON.stringify(err));
        throw new InternalServerError();
      }
      
      body = qs.parse(body);
      
      if (body.ACK === 'Success') {
        // Save userInfo to session
        self.session.set('userInfo', body);
      } else {
        self.flash.error('Auth was unsuccessful.');
      }
      
      self.redirect('/');
    });
  };
  
  /*
   * Cancels current session and redirects to home
   */
  this.logout = function (req, resp, params) {
    // Unset userInfo session value to "log out"
    this.session.unset('userInfo');
    this.flash.success('You have successfully logged out.');
    this.redirect('/');
  };
  
};

exports.Main = Main;
