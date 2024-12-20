<?php

namespace Drupal\ike_pivitol_moments\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

/**
 * An example controller.
 */
class ExperienceController extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function content() {
    $build = [
      '#theme' => 'html__experience',
      '#variables' => [
        'title' => 'Film Experience',
        'path' => $this->getModulePath(),
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
    return $module_handler->getModule('ike_pivitol_moments')->getPath();
  }

}
