import { useDispatch, useSelector } from 'react-redux';
import { tableSelector } from '../../store/selectors/table.selector';
import { featureSelector } from '../../store/selectors/feature/feature.selector';
import { useEffect } from 'react';
import { getFeatureData } from '../../store/reducers/feature/feature';

const FeatureTable = () => {
  const { featureResponse, isDataLoading, totalCount } = useSelector(featureSelector);
  const { pageIndex, pageSize } = useSelector(tableSelector);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getFeatureData());
    },
    pageIndex,
    pageSize
  );

  return (
    <div>
      <TableGrid>
        column={config}
        rows={featureResponse}
        showPagination ={true}
        exportOption ={' '}
        {{
          showExport: true,
          FileName: 'Feature',
        }}
        isDataLoading={isDataLoading}
        totalCount={totalCount}
      </TableGrid>
    </div>
  );
};

export default FeatureTable;
