<?php

namespace Drupal\ike_timeline\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

/**
 * An example controller.
 */
class TimelineController extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function content() {
    $build = [
      '#theme' => 'html__timeline',
      '#variables' => [
        'title' => 'Eisenhower Interactive Timeline',
        'path' => $this->getModulePath(),
        'hello' => 'Regular',
      ],
    ];

    $html = \Drupal::service('renderer')->renderRoot($build);
    $response = new Response();
    $response->setContent($html);

    return $response;
  }

  /**
   * Generates the mobile render array.
   */
  public function contentMobile() {
    $build = [
      '#theme' => 'html__timeline-mobile',
      '#variables' => [
        'title' => 'Eisenhower Interactive Timeline',
        'path' => $this->getModulePath(),
        'hello' => 'Regular',
      ],
    ];

    $html = \Drupal::service('renderer')->renderRoot($build);
    $response = new Response();
    $response->setContent($html);

    return $response;
  }

  /**
   * Generates the content internally.
   */
  public function contentInternal($milestone_name) {
    $needs_wrapper = FALSE;
    $referer = '';

    if (array_key_exists('HTTP_REFERER', $_SERVER)) {
      $referer = $_SERVER['HTTP_REFERER'];
    }
    else {
      $needs_wrapper = TRUE;
    }

    if (is_null($referer) && strpos($referer, $_SERVER['REQUEST_URI']) == FALSE) {
      $needs_wrapper = TRUE;
    }

    // Sets wrapper given parameter in url. See extra.js. Disabled for now.
    // if ($_GET['wrap']) {
    // $needs_wrapper = true;
    // }.
    $build = [
      '#theme' => 'html__timeline_internal',
      '#variables' => [
        'title' => 'Eisenhower Interactive Timeline',
        'path' => $this->getModulePath(),
        'milestone_name' => $milestone_name,
        'needs_wrapper' => $needs_wrapper,
      ],
    ];

    $html = \Drupal::service('renderer')->renderRoot($build);
    $response = new Response();
    $response->setContent($html);

    return $response;
  }

  /**
   * Generate the content internally for mobile.
   */
  public function contentInternalMobile($milestone_name) {
    $needs_wrapper = FALSE;
    $referer = '';

    if (array_key_exists('HTTP_REFERER', $_SERVER)) {
      $referer = $_SERVER['HTTP_REFERER'];
    }
    else {
      $needs_wrapper = TRUE;
    }

    if (is_null($referer) && strpos($referer, $_SERVER['REQUEST_URI']) == FALSE) {
      $needs_wrapper = TRUE;
    }

    if ($_GET['wrap']) {
      $needs_wrapper = TRUE;
    }

    $build = [
      '#theme' => 'html__timeline_internal_mobile',
      '#variables' => [
        'title' => 'Eisenhower Interactive Timeline',
        'path' => $this->getModulePath(),
        'milestone_name' => $milestone_name,
        'needs_wrapper' => $needs_wrapper,
      ],
    ];

    $html = \Drupal::service('renderer')->renderRoot($build);
    $response = new Response();
    $response->setContent($html);

    return $response;
  }

  /**
   * Get the module path for this module.
   */
  public function getModulePath() {
    $module_handler = \Drupal::service('module_handler');
    return $module_handler->getModule('ike_timeline')->getPath();
  }

}
