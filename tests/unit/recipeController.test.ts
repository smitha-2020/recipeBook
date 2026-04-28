import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const {
  sortMock,
  findMock,
  createMock,
  deleteOneMock,
  findByIdAndUpdateMock,
  categoryFindLeanMock,
  categoryFindMock,
  convertToValidObjectIdMock,
} = vi.hoisted(() => {
  const _sortMock = vi.fn();
  const _findMock = vi.fn();
  const _createMock = vi.fn();
  const _deleteOneMock = vi.fn();
  const _findByIdAndUpdateMock = vi.fn();
  const _categoryFindLeanMock = vi.fn();
  const _categoryFindMock = vi.fn(() => ({ lean: _categoryFindLeanMock }));
  const _convertToValidObjectIdMock = vi.fn();

  return {
    sortMock: _sortMock,
    findMock: _findMock,
    createMock: _createMock,
    deleteOneMock: _deleteOneMock,
    findByIdAndUpdateMock: _findByIdAndUpdateMock,
    categoryFindLeanMock: _categoryFindLeanMock,
    categoryFindMock: _categoryFindMock,
    convertToValidObjectIdMock: _convertToValidObjectIdMock,
  };
});

vi.mock("../../src/model/recipe.js", () => ({
  Recipe: {
    find: findMock,
    create: createMock,
    deleteOne: deleteOneMock,
    findByIdAndUpdate: findByIdAndUpdateMock,
  },
}));

vi.mock("../../src/model/category.js", () => ({
  Category: {
    find: categoryFindMock,
  },
}));

vi.mock("../../src/helpers/utils.js", () => ({
  convertToValidObjectId: convertToValidObjectIdMock,
}));

import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipes,
  sortRecipes,
  updateRecipe,
} from "../../src/controller/recipeController.js";

function createRes() {
  const res = {
    status: vi.fn(),
    send: vi.fn(),
  };
  res.status.mockReturnValue(res);
  res.send.mockReturnValue(res);
  return res;
}

describe("recipeController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findMock.mockImplementation(() => ({ sort: sortMock }));
  });

  it("getRecipes returns 200 with default descending sort", async () => {
    const req = { query: {} } as any;
    const res = createRes();
    const rows = [{ _id: "1" }];
    sortMock.mockResolvedValue(rows);

    await getRecipes(req, res as any);

    expect(findMock).toHaveBeenCalledWith({});
    expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(rows);
  });

  it("getRecipes applies boolean query filters", async () => {
    const req = {
      query: { isVegan: "true", isFav: "false", sorting: "asc" },
    } as any;
    const res = createRes();
    sortMock.mockResolvedValue([{ _id: "1" }]);

    await getRecipes(req, res as any);

    expect(findMock).toHaveBeenCalledWith({ isVegan: true, isFav: false });
    expect(sortMock).toHaveBeenCalledWith({ updatedAt: 1 });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it("getRecipes applies categoryId filter branch", async () => {
    const categoryId = String(new mongoose.Types.ObjectId());
    const req = {
      query: { categoryId, sorting: "desc" },
    } as any;
    const res = createRes();
    const rows = [{ _id: "1" }];
    sortMock.mockResolvedValue(rows);

    await getRecipes(req, res as any);

    expect(findMock).toHaveBeenCalledWith({ category: categoryId });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(rows);
  });

  it("getRecipes returns 404 when no records exist", async () => {
    const req = { query: {} } as any;
    const res = createRes();
    sortMock.mockResolvedValue([]);

    await getRecipes(req, res as any);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith([]);
  });

  it("getRecipeById returns 404 when recipe is missing", async () => {
    const req = { params: { id: "abc" } } as any;
    const res = createRes();
    convertToValidObjectIdMock.mockReturnValue("oid");
    findMock.mockResolvedValue([]);

    await getRecipeById(req, res as any);

    expect(findMock).toHaveBeenCalledWith({ _id: "oid" });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith("Recipe could not be found!");
  });

  it("getRecipeById returns 200 when recipe exists", async () => {
    const req = { params: { id: "abc" } } as any;
    const res = createRes();
    const rows = [{ _id: "oid" }];
    convertToValidObjectIdMock.mockReturnValue("oid");
    findMock.mockResolvedValue(rows);

    await getRecipeById(req, res as any);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalledWith(rows);
  });

  it("deleteRecipe returns 200 after successful deletion", async () => {
    const req = { params: { id: "abc" } } as any;
    const res = createRes();
    convertToValidObjectIdMock.mockReturnValue("oid");
    deleteOneMock.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

    await deleteRecipe(req, res as any);

    expect(deleteOneMock).toHaveBeenCalledWith({ _id: "oid" });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it("deleteRecipe returns 404 when nothing is deleted", async () => {
    const req = { params: { id: "abc" } } as any;
    const res = createRes();
    convertToValidObjectIdMock.mockReturnValue("oid");
    deleteOneMock.mockResolvedValue(null);

    await deleteRecipe(req, res as any);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith("Not deleted");
  });

  it("createRecipe generates categorySnapshot from categories", async () => {
    const catId = new mongoose.Types.ObjectId();
    const req = {
      body: {
        category: [catId],
        title: "Test title",
        slug: "test-recipe-slug",
        affordability: "affordable",
        complexity: "simple",
        imageUrl: "https://example.com/image.jpg",
        duration: 15,
        ingredients: ["water"],
        steps: ["mix"],
        isGlutenFree: true,
        isVegan: false,
        isVegetarian: true,
        isLactoseFree: true,
        isFav: false,
        reviewedBy: [],
        postedBy: new mongoose.Types.ObjectId(),
      },
    } as any;
    const res = createRes();

    categoryFindLeanMock.mockResolvedValue([
      { _id: catId, slug: "main", title: "Main", color: "#ffffff" },
    ]);
    createMock.mockResolvedValue({ _id: "new-recipe" });

    await createRecipe(req, res as any);

    expect(categoryFindMock).toHaveBeenCalledWith({ _id: { $in: [catId] } });
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: [catId],
        categorySnapshot: [{ slug: "main", title: "Main", color: "#ffffff" }],
      }),
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it("createRecipe returns 404 when creation fails", async () => {
    const catId = new mongoose.Types.ObjectId();
    const req = {
      body: {
        category: [catId],
        title: "Test title",
        slug: "test-recipe-slug",
        affordability: "affordable",
        complexity: "simple",
        imageUrl: "https://example.com/image.jpg",
        duration: 15,
        ingredients: ["water"],
        steps: ["mix"],
        isGlutenFree: true,
        isVegan: false,
        isVegetarian: true,
        isLactoseFree: true,
        isFav: false,
        reviewedBy: [],
        postedBy: new mongoose.Types.ObjectId(),
      },
    } as any;
    const res = createRes();

    categoryFindLeanMock.mockResolvedValue([
      { _id: catId, slug: "main", title: "Main", color: "#ffffff" },
    ]);
    createMock.mockResolvedValue(null);

    await createRecipe(req, res as any);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith("Recipe could not be created");
  });

  it("updateRecipe adds categorySnapshot and updatedAt", async () => {
    const recipeId = new mongoose.Types.ObjectId();
    const catId = new mongoose.Types.ObjectId();
    const req = {
      params: { id: String(recipeId) },
      body: { category: [String(catId)] },
    } as any;
    const res = createRes();

    convertToValidObjectIdMock.mockImplementation((id: string) =>
      new mongoose.Types.ObjectId(id),
    );
    categoryFindLeanMock.mockResolvedValue([
      { _id: catId, slug: "s", title: "t", color: "#111111" },
    ]);
    findByIdAndUpdateMock.mockResolvedValue({ _id: recipeId });

    await updateRecipe(req, res as any);

    expect(findByIdAndUpdateMock).toHaveBeenCalledWith(
      expect.any(mongoose.Types.ObjectId),
      {
        $set: expect.objectContaining({
          category: [String(catId)],
          categorySnapshot: [{ _id: catId, slug: "s", title: "t", color: "#111111" }],
          updatedAt: expect.any(Number),
        }),
      },
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });

  it("updateRecipe returns 404 when recipe is not updated", async () => {
    const recipeId = new mongoose.Types.ObjectId();
    const catId = new mongoose.Types.ObjectId();
    const req = {
      params: { id: String(recipeId) },
      body: { category: [String(catId)] },
    } as any;
    const res = createRes();

    convertToValidObjectIdMock.mockImplementation((id: string) =>
      new mongoose.Types.ObjectId(id),
    );
    categoryFindLeanMock.mockResolvedValue([
      { _id: catId, slug: "s", title: "t", color: "#111111" },
    ]);
    findByIdAndUpdateMock.mockResolvedValue(null);

    await updateRecipe(req, res as any);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.send).toHaveBeenCalledWith("Recipe with ID could not be updated");
  });

  it("sortRecipes sorts descending when requested", async () => {
    const req = { params: { sorting: "desc" } } as any;
    const res = createRes();
    sortMock.mockResolvedValue([{ _id: "1" }]);

    await sortRecipes(req, res as any);

    expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
  });
});
