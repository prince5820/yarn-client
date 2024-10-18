import { Container, FormControl, Grid, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Delete from '../../assets/icon/common/delete.svg?react';
import Edit from '../../assets/icon/common/edit.svg?react';
import Plus from '../../assets/icon/common/plus.svg?react';
import Search from '../../assets/icon/common/search.svg?react';
import Close from '../../assets/icon/common/close.svg?react';
import { useAppDispatch } from "../../store";
import { getCategories } from "../../store/category/thunk";
import { Category as CategoryResponse } from "../../store/category/types";
import { setMessage } from "../../store/snackbar/reducer";
import { SNACKBAR_ERROR } from "../../common/message";
import AddCategoryDialog from "../../common/components/dialog/add-category-dialog";
import DeleteCategoryDialog from "../../common/components/dialog/delete-category-dialog";

const Category = () => {
  const [search, setSearch] = useState<string>('');
  const [getCategoryResponse, setGetCategoryResponse] = useState<CategoryResponse[] | null>(null);
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState<boolean>(false);
  const [openEditCategoryDialog, setOpenEditCategoryDialog] = useState<boolean>(false);
  const [openDeleteCategoryDialog, setDeleteCategoryDialog] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const userId = localStorage.getItem('userId');
  const dispatch = useAppDispatch();

  useEffect(() => {
    getCategoriesById();
  }, []);

  const getCategoriesById = async () => {
    if (userId) {
      try {
        const response = await dispatch(getCategories(userId))
        setGetCategoryResponse(response)
      } catch (err) {
        dispatch(setMessage({ msg: err, className: SNACKBAR_ERROR }))
      }
    }
  }

  const filteredCategories = getCategoryResponse?.filter(category =>
    category.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setOpenEditCategoryDialog(true);
  }

  const handleDeleteClick = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setDeleteCategoryDialog(true);
  }

  return (
    <>
      <Container className="wrapper-category padding-wrapper-for-non-auth max-width-wrapper">
        <Typography variant="h6" className="text-center mb-16">Categories</Typography>
        <FormControl fullWidth className="mb-16" variant="outlined">
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <Search className="svg-icon" />
              </InputAdornment>
            }
            endAdornment={
              search && (
                <InputAdornment position="end">
                  <Close className="svg-icon" onClick={() => setSearch('')} />
                </InputAdornment>
              )
            }
            placeholder="Search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FormControl>
        <Container disableGutters className="mb-16">
          <Grid container spacing={1}>
            <Grid item xs={11}>
              <Typography variant="body2" className="categories-text">Categories</Typography>
            </Grid>
            <Grid item xs={1}>
              <Plus className="svg-icon" onClick={() => setOpenAddCategoryDialog(true)} />
            </Grid>
          </Grid>
        </Container>
        <Container disableGutters>
          <Grid container spacing={1}>
            {
              filteredCategories && filteredCategories.length > 0 ? filteredCategories.map((category: CategoryResponse) => (
                <React.Fragment key={category.id}>
                  <Grid item xs={10}>
                    {category.categoryName}
                  </Grid>
                  <Grid item xs={1}>
                    <Edit className="svg-icon" onClick={() => handleEditClick(category)} />
                  </Grid>
                  <Grid item xs={1}>
                    <Delete className="svg-icon" onClick={() => handleDeleteClick(category)} />
                  </Grid>
                </React.Fragment>
              )) :
                <Grid item xs={12}>
                  <Typography variant="body2">No Record found</Typography>
                </Grid>
            }
          </Grid>
        </Container>
      </Container>
      <AddCategoryDialog
        dialogTitle="Add Category"
        buttonName="Add"
        open={openAddCategoryDialog}
        onClose={() => { setOpenAddCategoryDialog(false); getCategoriesById(); }}
      />
      <AddCategoryDialog
        dialogTitle="Edit Category"
        buttonName="Edit"
        open={openEditCategoryDialog}
        onClose={() => { setOpenEditCategoryDialog(false); setSelectedCategory(null); getCategoriesById(); }}
        category={selectedCategory}
      />
      <DeleteCategoryDialog
        open={openDeleteCategoryDialog}
        onClose={() => { setDeleteCategoryDialog(false); setSelectedCategory(null); getCategoriesById(); }}
        category={selectedCategory}
      />
    </>
  )
}

export default Category;