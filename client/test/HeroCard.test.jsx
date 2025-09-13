import { render, screen } from "@testing-library/react";
import HeroCard from "../src/components/HeroCard";
import { MemoryRouter } from "react-router-dom";

const base = {
  id: "h1",
  nickname: "Batman",
  images: [],
};

test('shows "No image" when no imageSigned', () => {
  render(
    <MemoryRouter>
      <HeroCard item={base} />
    </MemoryRouter>
  );

  expect(screen.getByText(/No image/i)).toBeInTheDocument();
  expect(screen.getByText(/Batman/)).toBeInTheDocument();
});

test("renders <img> when imageSigned is provided", () => {
  const withImg = { ...base, imageSigned: "https://ex/1.jpg" };
  render(
    <MemoryRouter>
      <HeroCard item={withImg} />
    </MemoryRouter>
  );
  const img = screen.getByRole("img", { name: /Batman/i });
  expect(img).toHaveAttribute("src", "https://ex/1.jpg");
});
