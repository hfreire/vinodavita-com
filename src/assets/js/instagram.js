/*
 * Copyright (c) 2019, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

$(document).ready(function () {

  'use strict'

  // =====================
  // Instagram Feed
  // Get your userId and accessToken from the following URLs, then replace the new values with the
  // the current ones.
  // userId: http://codeofaninja.com/tools/find-instagram-user-id/
  // accessToken: http://instagram.pixelunion.net/
  // =====================

  var instagramFeed = new Instafeed({
    get: 'user',
    limit: 4,
    resolution: 'standard_resolution',
    userId: '9268890053',
    accessToken: '9268890053.1677ed0.4860ac9184e2427389df96605a6dd73c',
    template:
      '<div class="c-widget-instagram__item"><a href="{{link}}" title="{{caption}}" aria-label="{{caption}}" target="_blank" class="c-widget-instagram__image" style="background-image: url({{image}})"></a></div>'
  })

  if ($('#instafeed').length) {
    instagramFeed.run()
  }
})
