/*
 * Copyright 2016 Claymore Minds Limited and Niche Solutions (UK) Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function () {
    return function() {
        return function (input) {

            switch (input) {
                case 1:
                    return 'Boolean';
                    break;
                case 2:
                    return 'Byte';
                    break;
                case 3:
                    return 'Short';
                    break;
                case 4:
                    return 'Integer';
                    break;
                case 5:
                    return 'Long';
                    break;
                case 6:
                    return 'Float';
                    break;
                case 7:
                    return 'Double';
                    break;
                case 8:
                    return 'String';
                    break;
                case 9:
                    return 'Nullable Boolean';
                    break;
                default:
                    return input;
            }
        }
    };
});
