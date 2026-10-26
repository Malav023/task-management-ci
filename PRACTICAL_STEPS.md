# GitHub Actions CI – Task Management App (MERN)

## Project structure
```
task-management-ci/
├── .github/workflows/ci.yml   <- the pipeline
├── backend/                   <- Express + MongoDB API, Jest tests
│   └── tests/task.test.js     <- automated tests
├── frontend/                  <- React (Vite)
└── demo/
    ├── broken/task.test.js    <- deliberately failing test
    └── fixed/task.test.js     <- corrected test
```

## Step 1 – Create the GitHub repository
1. Go to github.com > New repository > name it `task-management-ci` > Create (do not add README).
2. Unzip the project, open a terminal inside the folder.

## Step 2 – Run locally first (optional check)
```bash
cd backend
npm install
npm test          # all 5 tests should pass
```

## Step 3 – Push the project to the main branch (first pipeline run = PASS)
```bash
git init
git add .
git commit -m "Initial commit: Task Management app with CI"
git branch -M main
git remote add origin https://github.com/<your-username>/task-management-ci.git
git push -u origin main
```
Open the repo > **Actions** tab > "Task Management CI". You will see:
- Install dependencies (`npm install`)  ✔
- Run automated tests (`npm test`)  ✔  -> **green tick = PASS**
Take a screenshot (Screenshot 1: passing pipeline).

## Step 4 – Demonstrate a FAILED pipeline (broken test)
Replace the test with the deliberately broken version:
```bash
# from the project root
cp demo/broken/task.test.js backend/tests/task.test.js      # Linux/Mac
# Windows (cmd):  copy demo\broken\task.test.js backend\tests\task.test.js
git add .
git commit -m "Add broken test to demonstrate failing pipeline"
git push origin main
```
(Or edit `backend/tests/task.test.js` by hand: change `toBe('ok')` to `toBe('down')`.)

In **Actions**:
- The latest run shows a red cross ✘ -> **FAIL**
- Click the run > `Backend - Install & Test` > `Run automated tests`
  to see: `Expected: "down"  Received: "ok"` and `Tests: 1 failed, 4 passed`.
- The frontend job is skipped because it `needs` the backend job.
Take a screenshot (Screenshot 2: failed pipeline + error log).

## Step 5 – Demonstrate the FIXED pipeline
```bash
cp demo/fixed/task.test.js backend/tests/task.test.js       # Windows: copy demo\fixed\task.test.js backend\tests\task.test.js
git add .
git commit -m "Fix broken test"
git push origin main
```
In **Actions** the new run turns green ✔ -> **PASS** (both jobs).
Take a screenshot (Screenshot 3: fixed pipeline).

## Step 6 – What to include in your practical report
- Screenshot of `ci.yml`
- Screenshot 1: first passing run
- Screenshot 2: failed run (with failing test log)
- Screenshot 3: passing run after fix
- Commit history showing: Initial commit -> Broken test -> Fix

## Workflow explained
| Part | Meaning |
|------|---------|
| `on: push: branches: [main]` | Triggers on every push to main |
| `actions/checkout@v4` | Downloads repo code onto the runner |
| `actions/setup-node@v4` | Installs Node.js 20 |
| `npm install` | **Defined install-dependencies step** |
| `npm test` | Runs Jest tests; non-zero exit = pipeline FAIL |
| `needs: backend-test` | Frontend build only runs if tests pass |

## Common problems
- **Workflow doesn't start:** file must be at `.github/workflows/ci.yml` and branch must be `main`.
- **Cache error "lock file not found":** make sure `backend/package-lock.json` is committed.
- **Push rejected:** run `git pull origin main --rebase` then push again.
