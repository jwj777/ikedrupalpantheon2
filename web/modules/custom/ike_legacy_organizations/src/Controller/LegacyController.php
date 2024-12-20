<?php

namespace Drupal\ike_legacy_organizations\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

/**
 * An example controller.
 */
class LegacyController extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function content() {
    $build = [
      '#theme' => 'html__legacy',
      '#variables' => [
        'title' => 'DWIGHT D. EISENHOWER LEGACY ORGANIZATIONS',
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
    return $module_handler->getModule('ike_legacy_organizations')->getPath();
  }

}
