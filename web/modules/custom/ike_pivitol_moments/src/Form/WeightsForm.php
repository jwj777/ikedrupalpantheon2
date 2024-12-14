<?php

namespace Drupal\ike_pivitol_moments\Form;

use Drupal\Core\Database\Database;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;

/**
 * Class FilesForm.
 */
class WeightsForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'weights_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    foreach ($form_state->getValues() as $key => $value) {
      // @todo Validate fields.
    }
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $database = Database::getConnection('default', 'drupal7');

    $query = $database->select('weight_weights', 'w');
    $query->leftJoin('node', 'n', 'w.entity_id = n.nid');
    $query->condition('n.type', ['pm_subtheme', 'pivotal_moment_slideshow'], 'IN');
    $query->fields('n', ['nid', 'vid', 'type'])
      ->fields('w', ['weight']);
    $array = $query->execute()->fetchAll();

    foreach ($array as $elem) {
      $node = Node::load($elem->nid);
      if (!empty($node)) {
        if ($elem->type == "pm_subtheme") {
          $node->set('field_slide_weight', $elem->weight);
        }
        else {
          $node->set('field_slideshow_weight', $elem->weight);
        }
        $node->save();
      }
    }
  }

}
