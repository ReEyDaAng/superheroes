import * as heroService from "./hero.service.js";

export async function list(req, res, next) {
  try {
    res.json(await heroService.list(req.query));
  } catch (e) {
    next(e);
  }
}
export async function getById(req, res, next) {
  try {
    const hero = await heroService.getById(req.params.id);
    if (!hero) return res.status(404).json({ message: "Not found" });
    res.json(hero);
  } catch (e) {
    next(e);
  }
}
export async function create(req, res, next) {
  try {
    res.status(201).json(await heroService.create(req.body));
  } catch (e) {
    next(e);
  }
}
export async function update(req, res, next) {
  try {
    res.json(await heroService.update(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
}
export async function remove(req, res, next) {
  try {
    await heroService.remove(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
