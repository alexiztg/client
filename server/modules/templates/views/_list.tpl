<table class="ui sortable celled compact small basic table" ng-init="currentPage = 1">
  <thead>
    <tr>
{[list_headers]}
    </tr>
  </thead>
  <tbody>
    <tr dir-paginate="i in list_{[entity_name]} | filter: query | orderBy: orden | itemsPerPage: 12" current-page="currentPage">
{[list_columns]}
    </tr>
  </tbody>
  <tfoot>
    <tr style="text-align: center;">
      <th colspan="100">
        <dir-pagination-controls boundary-links="true" on-page-change="pageChangeHandler(newPageNumber)">
        </dir-pagination-controls>
      </th>
    </tr>
  </tfoot>
</table>
