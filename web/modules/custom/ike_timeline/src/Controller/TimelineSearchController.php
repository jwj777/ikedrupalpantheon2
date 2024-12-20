<?php

namespace Drupal\ike_timeline\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * The controller for searching the Timeline.
 */
class TimelineSearchController extends ControllerBase {

  /**
   * The search command that returns the results.
   */
  public function search() {
    $result = [];

    $term = $_GET['term'];
    $json = json_decode(file_get_contents($this->siteUrl() . '/modules/custom/ike_timeline/src/static/api/milestones.json'), TRUE);

    foreach ($json['data'] as $milestone) {
      $title = $milestone['title'];

      if (preg_match("/{$term}/i", $title)) {
        $result[] = [
          'collection' => 'milestones',
          'oid' => $milestone['oid'],
          'title' => $title,
        ];
      }
    }

    $results_container = ['results' => $result];
    return new JsonResponse($results_container);
  }

  /**
   * Get's the current site URL derived from environment variables.
   */
  public function siteUrl() {
    $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') ||
      $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $domainName = $_SERVER['HTTP_HOST'];
    return $protocol . $domainName;
  }

}
