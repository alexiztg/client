<form class="ui form">
  {[new_form]}
</form>
<div class="ui error message" ng-show="new_{[entity_name]}.err" style="text-align: center;">
  {[ new_{[entity_name]}.err ]}
</div>
<div class="ui positive message" ng-show="new_{[entity_name]}.id" style="text-align: center;">
  Listo {[ new_{[entity_name]}.id ]}
</div>
<br>
<button class="ui positive button right floated" ng-hide="new_{[entity_name]}.id > 0" ng-disabled="" ng-click="">Guardar</button>
