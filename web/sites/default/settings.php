<?php

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

include __DIR__ . "/settings.pantheon.php";

$local_settings = __DIR__ . "/settings.local.php";
if (file_exists($local_settings)) {
  include $local_settings;
}

// Automatically generated include for settings managed by ddev.
$ddev_settings = dirname(__FILE__) . '/settings.ddev.php';
if (getenv('IS_DDEV_PROJECT') == 'true' && is_readable($ddev_settings)) {
  require $ddev_settings;
}

// Redirects

if (isset($_SERVER['REQUEST_URI'])) {
  $path = $_SERVER['REQUEST_URI'];

  // Redirect /ikessoldiers/<soldier-name> to /soldiers/<soldier-name>
  if (preg_match('#^/ikessoldiers/(.*)$#', $path, $matches)) {
      header("HTTP/1.1 301 Moved Permanently");
      header("Location: /soldier/" . $matches[1]);
      exit();
  }
}


if (isset($_SERVER['REQUEST_URI'])) {
  $redirects = [
      "/learn/about-the-foundation" => "/page/about-foundation",
      "/ike-insight" => "/resources/home",
      "/index.php/research-travel-grants" => "/page/research-travel-grants",
      "/edguide" => "/page/educators-guide",
      "/ikeducation" =>" /education-home/ikeducation",
      "/ikeducation/virtual-classroom" => "/page/virtual-classroom",
      "/index.php/library" => "/page/primary-source-library",
      "/ikes-soldiers" => "/page/ikes-soldiers",
      "/join-and-give/friends" => "/page/friends-foundation",
      "/join-and-give/sponsors" => "/page/sponsors",
      "/join-and-give/donor-wall" => "/page/donor-wall",
      "/index.php/ks-tax-credits" => "/page/kansas-tax-credits",
      "/volunteer-0" => "/page/volunteer-eisenhower-foundation",
      // Education Redirects
      "/ikeducation" => "/education-home/ikeducation",
      "/ikeducation/experience" => "/page/book-your-experience",
      "/ikeducation/ikexpress" => "/page/educators-guide",
      "/ikeducation/lesson-plans" => "/page/lesson-plans",
      "/ikeducation/lesson-plans/1952-election-new-kind-campaign" => "/lesson-plan/1952-election-new-kind-campaign",
      "/ikeducation/lesson-plans/art-deception-selling-story-german-army" => "/lesson-plan/art-deception-selling-story-german-army",
      "/ikeducation/lesson-plans/atoms-peace-eisenhower-and-nuclear-technology" => "/lesson-plan/atoms-peace-eisenhower-and-nuclear-technology",
      "/ikeducation/lesson-plans/attic-artifacts-101st-airborne" => "/lesson-plan/attic-artifacts-101st-airborne",
      "/ikeducation/lesson-plans/attic-artifacts-women-home-front" => "/lesson-plan/attic-artifacts-women-home-front",
      "/ikeducation/lesson-plans/attic-artifacts-world-war-ii-kids" => "/lesson-plan/attic-artifacts-wwii-kids",
      "/ikeducation/lesson-plans/cold-war-kids-duck-cover" => "/lesson-plan/cold-war-kids-duck-cover",
      "/ikeducation/lesson-plans/cold-war-kids-space-race" => "/lesson-plan/cold-war-kids-space-race",
      "/ikeducation/lesson-plans/conclusion-research-and-informative-speech-project" => "/lesson-plan/conclusion-research-and-informative-speech-project",
      "/ikeducation/lesson-plans/d-day-advising-eisenhower" => "/lesson-plan/d-day-advising-eisenhower",
      "/ikeducation/lesson-plans/d-day-primarily-omaha-beach" => "/program/primarily-omaha-beach",
      "/ikeducation/lesson-plans/d-day-whether-weather-matters" => "/lesson-plan/d-day-whether-weather-matters",
      "/ikeducation/lesson-plans/desegregating-little-rock" => "/lesson-plan/desegregating-little-rock",
      "/ikeducation/lesson-plans/dogs-defense-hero-hounds" => "/lesson-plan/dogs-defense-hero-hounds",
      "/ikeducation/lesson-plans/dogs-defense-k-9-corps-3-5" => "/lesson-plan/dogs-defense-k-9-corps",
      "/ikeducation/lesson-plans/eisenhower-and-origins-nato" => "/lesson-plan/eisenhower-and-origins-nato",
      "/ikeducation/lesson-plans/plain-sight-d-day-deception" => "/lesson-plan/plain-sight-d-day-deception",
      "/ikeducation/lesson-plans/eisenhower-and-responsibility-president" => "/lesson-plan/eisenhower-and-responsibility-president",
      "/ikeducation/lesson-plans/eisenhower-and-troops-story-photograph" => "/lesson-plan/eisenhower-and-troops-story-photograph",
      "/ikeducation/teachers" => "/page/teachers-resources",
      "/ikeducation/virtual-classroom" => "/page/virtual-classroom",
      "/quotes" => "/page/eisenhower-quotes",
      // Ike's Life
      "/ikes-life" => "/page/ikes-life",
      "/ikes-life/boyhood" => "/ikes-life/boyhood",
      "/ikes-life/candidate-1951-1953" => "/ikes-life/candidate",
      "/ikes-life/clouds-war-1935-1940" => "/ikes-life/clouds-war",
      "/ikes-life/early-military" => "/era/early-military",
      "/ikes-life/general" => "/era/general",
      "/ikes-life/great-war-years-1915-1919" => "/ikes-life/great-war-years",
      "/ikes-life/hard-war-bitter-bloody-war-1941-1944" => "/ikes-life/hard-war-bitter-bloody-war",
      "/ikes-life/ikes-family-1951-1953" => "/ikes-life/ikes-family",
      "/ikes-life/ikes-family-1953-1957" => "/ikes-life/ikes-family",
      "/ikes-life/ikes-family-1957-1961" => "/ikes-life/ikes-family",
      "/ikes-life/ikes-first-term-president-1953-1957" => "/ikes-life/ikes-first-term-president",
      "/ikes-life/ikes-second-term-president-1957-1961" => "/ikes-life/ikes-second-term-president",
      "/ikes-life/nothing-less-full-victory-1944-1945" => "/ikes-life/nothing-less-full-victory",
      "/ikes-life/post-war-1945-1951" => "/ikes-life/post-war",
      "/ikes-life/president" => "/era/presidency",
      "/ikes-life/statesman" => "/ikes-life/statesman",
      "/ikes-life/washington-years-1927-1935" => "/ikes-life/washington-years",
      "/ikes-life/watershed-years-1919-1927" => "/ikes-life/watershed-years",
      "/ikes-life/west-point" => "/ikes-life/west-point",
      // Articles
      "/ike-insight/2019-eisenhower-legacy-award" => "/resources/home",
      "/ike-insight/2020-uss-dwight-d-eisenhower-leadership-awards" => "/resources/home",
      "/ike-insight/2021-2022-educators-guide" => "/resources/home",
      "/ike-insight/2021-dickinson-county-ks-donate-day-record-year" => "/resources/home",
      "/ike-insight/2022-strategic-plan-exploring-space-future" => "/article/2022-strategic-plan-exploring-space-future",
      "/ike-insight/75000-raised-honor-75th-anniversary" => "/resources/home",
      "/ike-insight/abilene-bridge-club-sponsors-6th-annual-benefit-ikeducation" => "/resources/home",
      "/ike-insight/boyhood-home-project-complete" => "/article/boyhood-home-project-complete",
      "/ike-insight/eisenhower-foundation-75-years-history" => "/resources/home",
      "/ike-insight/eisenhower-foundation-thrives-because-your-gifts" => "/resources/home",
      "/ike-insight/eisenhower-foundation-website-our-digital-bridge" => "/resources/home",
      "/ike-insight/eisenhower-memorial-online-resources" => "/resources/home",
      "/ike-insight/eisenhower-piece-ground-debuts-broadway" => "/article/eisenhower-piece-ground-debuts-broadway",
      "/ike-insight/eisenhower-presidential-museum-exhibits-open-public" => "/resources/home",
      "/ike-insight/eisenhower-statue-unveiled-kansas-state-capitol" => "/resources/home",
      "/ike-insight/estate-gift-received-former-eisenhower-speechwriter" => "/article/estate-gift-received-former-eisenhower-speechwriter",
      "/ike-insight/foundation-recognizes-distinguished-sailors" => "/resources/home",
      "/ike-insight/ft-riley-soldiers-recognized-outstanding-leadership" => "/article/ft-riley-soldiers-recognized-outstanding-leadership",
      "/ike-insight/giving-tuesday-goal-met-ikeducation" => "/article/giving-tuesday-goal-met-ikeducation",
      "/ike-insight/honoring-greatest-generation" => "/article/honoring-greatest-generation",
      "/ike-insight/ike-championed-modern-civil-rights-era" => "/resources/home",
      "/ike-insight/ikeducation-goes-global" => "/article/ikeducation-goes-global",
      "/ike-insight/ikeducation-partners-abilene-high-school" => "/article/ikeducation-partners-abilene-high-school",
      "/ike-insight/ikes-fountain-be-restored" => "/article/ikes-fountain-be-restored",
      "/ike-insight/kansas-governor-signs-eisenhower-statue-bill" => "/resources/home",
      "/ike-insight/kansas-residents-drive-ikes-legacy" => "/resources/home",
      "/ike-insight/laying-wreath-tradition" => "/article/laying-wreath-tradition",
      "/ike-insight/legacy-gala-held-october" => "/article/legacy-gala-held-october",
      "/ike-insight/little-ike-story-time-building-foundation" => "/resources/home",
      "/ike-insight/meeting-real-rosie-connie-palacioz" => "/resources/home",
      "/ike-insight/monument-sign-ribbon-cutting-and-dedication" => "/article/monument-sign-ribbon-cutting-and-dedication",
      "/ike-insight/partnering-wreaths-across-america" => "/article/partnering-wreaths-across-america",
      "/ike-insight/partnership-creating-3d-immersive-learning" => "/resources/home",
      "/ike-insight/presidential-primary-source-project" => "/article/presidential-primary-source-project",
      "/ike-insight/presidents-day-match-met" => "/article/presidents-day-match-met",
      "/ike-insight/site-field-trips-resume" => "/article/site-field-trips-resume",
      "/ike-insight/spotlight-event-symphony-sunset" => "/article/spotlight-event-symphony-sunset",
      "/ike-insight/state-kansas-tax-credits" => "/resources/home",
      "/ike-insight/stem-programs-launched" => "/resources/home",
      "/ike-insight/symphony-sunset-returns-after-two-year-hiatus" => "/article/symphony-sunset-returns-after-two-year-hiatus",
      "/ike-insight/thank-veteran-reception" => "/article/thank-veteran-reception",
      "/ike-insight/volunteer-eisenhower-foundation" => "/article/volunteer-eisenhower-foundation",
      "/ike-insight/world-goes-viral-ikeducation-goes-virtual" => "/resources/home",
      "/ike-insight/world-war-ii-heroes-honored-d-day-75th-anniversary" => "/resources/home"
  ];

  $current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

  if (array_key_exists($current_path, $redirects)) {
      header("HTTP/1.1 301 Moved Permanently");
      header("Location: " . $redirects[$current_path]);
      exit();
  }
}
