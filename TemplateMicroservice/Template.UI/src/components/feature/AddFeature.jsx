import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, } from 'react-redux';
import { addFeature, clearForm, updateFeature } from '../../services/feature/feature';
import { closeConfirmPopup, closeFormPopup, setEditMode } from '../../store/reducers/popup';
import { featureSelector } from '../../store/selectors/feature/feature.selector';
import { popupSelector } from '../../store/selectors/popup.selector';

const AddFeature = () => {
  const dispatch = useDispatch();
  const {
    addForm,
    Dropdownoptions: { code },
  } = useSelector(featureSelector);

  const formPopup = useSelector(popupSelector);

  const {
    control,
    formState: { error },
    watch,
    resetField,
    handlesubmit,
  } = useForm({
    defaultValues: addForm,
  });


  const onSubmit = (data) => {
      isEditMode ? dispatch(updateFeature(data)) : dispatch(addFeature(data));
    };


const handleclose = () =>{
      dispatch(closeFormPopup());
      dispatch(clearForm());
      dispatch(setEditMode(false));

}


return (
      <div>
            <form onSubmit={handlesubmit(onSubmit)}>

            </form>
            <div>
                  <
            </div>
      </div>
)






};


