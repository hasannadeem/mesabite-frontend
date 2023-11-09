// Libraries
import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";

// Custom components
import CategoryCard from "../CategoryCard";

// Utils
import { renderComponentWithRouter } from "../../../utils/testing/componentTestUtils";
import { TEST_IDS } from "../../../constants";
import { APIS } from "../../../constants/routes";

const mockUpdateMenus = jest.fn();

jest.mock("axios", () => ({
  delete: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

const defaultProps = {
  className: "mock-category-card",
  category: {
    id: "36",
    type: "category",
    attributes: {
      name: "Tajin",
      image:
        "/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBNQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--571d1ffe2264adc8ad81b269128460609b130e9d/burger.png",
      description: "The word tagine refers both to this traditional",
    },
  },
  updateMenus: mockUpdateMenus,
};

describe("Category Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should show correct category data", () => {
    render(
      renderComponentWithRouter({
        Component: CategoryCard,
        props: defaultProps,
      })
    );

    const CardContainerElement = screen.getByTestId(
      `${defaultProps.category.id}-${TEST_IDS.CATEGORY_CARD_PARENT}`
    );

    expect(CardContainerElement).toHaveClass(defaultProps.className);
    expect(
      screen.getByText(defaultProps.category.attributes.name)
    ).toBeInTheDocument();
    expect(
      screen.getByText(defaultProps.category.attributes.description)
    ).toBeInTheDocument();
  });

  it("Should delete category data", async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    const spyAxiosDelete = jest
      .spyOn(axios, "delete")
      .mockImplementation()
      .mockResolvedValue({
        status: 200,
      });
    render(
      renderComponentWithRouter({
        Component: CategoryCard,
        props: defaultProps,
      })
    );

    const deleteElement = screen.getByAltText("delete");
    await fireEvent.click(deleteElement);

    expect(spyAxiosDelete).toHaveBeenCalledWith(
      `${APIS.category}/${defaultProps.category.id}`
    );
  });
});
