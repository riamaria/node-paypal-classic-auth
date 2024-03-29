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

var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');
router.get('/auth/paypal').to('Main.paypalAuth');
router.get('/auth/paypal/callback').to('Main.paypalAuthCallback');
router.get('/logout').to('Main.logout');

exports.router = router;
