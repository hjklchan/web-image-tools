<script>
    import { UiButton } from "$lib/components/ui";
</script>

<UiButton>Hello</UiButton>

<div class="ui-container space-y-4">
    <!-- Header -->
    <header class="ui-panel">
        <div
            class="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
            <div class="flex items-baseline gap-3">
                <h1 class="ui-h1">Soft Retro UI Kit</h1>
                <span class="ui-badge">all components</span>
            </div>
            <nav class="ui-nav">
                <a class="ui-navlink" href="#components">Components</a>
                <a class="ui-navlink" href="#forms">Forms</a>
                <a class="ui-navlink" href="#data">Data</a>
            </nav>
        </div>
        <div class="ui-subbar">
            No animation • No shadow • Font mono everywhere
        </div>
    </header>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <!-- Sidebar -->
        <aside class="lg:col-span-3 space-y-4">
            <div class="ui-panel">
                <div class="ui-panel-hd">Menu</div>
                <div class="ui-panel-bd space-y-2">
                    <a class="ui-sidelink" href="#typography">Typography</a>
                    <a class="ui-sidelink" href="#components">Components</a>
                    <a class="ui-sidelink" href="#forms">Forms</a>
                    <a class="ui-sidelink" href="#data">Tables & Lists</a>
                </div>
            </div>

            <div class="ui-panel">
                <div class="ui-panel-hd">Info</div>
                <div class="ui-panel-bd ui-text">
                    统一：<span class="ui-kbd">border</span> +
                    <span class="ui-kbd">zinc</span>
                    + <span class="ui-kbd">bg-white/zinc-50</span>
                </div>
            </div>
        </aside>

        <!-- Main -->
        <main class="lg:col-span-9 space-y-4">
            <!-- Typography -->
            <section id="typography" class="ui-panel">
                <div class="ui-panel-hd">Typography</div>
                <div class="ui-panel-bd space-y-3">
                    <h2 class="ui-h2">Heading</h2>
                    <p class="ui-text">
                        这是正文示例，链接：<a class="ui-link" href="#"
                            >example</a
                        >
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <span class="ui-badge">badge</span>
                        <span class="ui-badge-strong">outline</span>
                        <span class="ui-badge-muted">muted</span>
                        <kbd class="ui-kbd">Ctrl</kbd><kbd class="ui-kbd">K</kbd
                        >
                    </div>
                </div>
            </section>

            <!-- Components -->
            <section id="components" class="ui-panel">
                <div class="ui-panel-hd">Components</div>
                <div class="ui-panel-bd space-y-4">
                    <!-- Buttons -->
                    <div class="ui-card">
                        <div class="ui-card-hd">Buttons</div>
                        <div class="ui-card-bd">
                            <div class="flex flex-wrap gap-2">
                                <button class="ui-btn">Default</button>
                                <button class="ui-btn ui-btn-primary"
                                    >Primary</button
                                >
                                <button class="ui-btn ui-btn-subtle"
                                    >Subtle</button
                                >
                                <button class="ui-btn ui-btn-disabled" disabled
                                    >Disabled</button
                                >
                            </div>
                        </div>
                    </div>

                    <!-- Cards + Stats -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <article class="ui-card">
                            <div class="ui-card-hd">Card</div>
                            <div class="ui-card-bd">
                                卡片内容。<a class="ui-link" href="#">link</a>
                                <div class="ui-card-actions">
                                    <button class="ui-btn ui-btn-sm"
                                        >Action</button
                                    >
                                    <button
                                        class="ui-btn ui-btn-sm ui-btn-subtle"
                                        >More</button
                                    >
                                </div>
                            </div>
                        </article>

                        <article class="ui-card">
                            <div class="ui-card-hd">Stats</div>
                            <div class="ui-stats">
                                <div class="ui-stat">
                                    <div class="ui-stat-k">Users</div>
                                    <div class="ui-stat-v">1,204</div>
                                </div>
                                <div class="ui-stat">
                                    <div class="ui-stat-k">Errors</div>
                                    <div class="ui-stat-v">12</div>
                                </div>
                                <div class="ui-stat">
                                    <div class="ui-stat-k">Uptime</div>
                                    <div class="ui-stat-v">99.9%</div>
                                </div>
                            </div>
                        </article>
                    </div>

                    <!-- Alerts / Toast -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div class="ui-alert">
                            <div class="ui-alert-title">INFO</div>
                            <div class="mt-1">信息提示框。</div>
                        </div>
                        <div class="ui-alert-strong">
                            <div class="ui-alert-title">NOTICE</div>
                            <div class="mt-1">强调提示（深边框）。</div>
                        </div>
                    </div>

                    <!-- Steps -->
                    <div class="ui-card">
                        <div class="ui-card-hd">Steps</div>
                        <ol class="ui-steps">
                            <li class="ui-step">
                                <span
                                    ><span class="ui-step-n">1.</span> Create</span
                                >
                                <span class="ui-badge">done</span>
                            </li>
                            <li class="ui-step">
                                <span
                                    ><span class="ui-step-n">2.</span> Review</span
                                >
                                <span class="ui-badge-strong">active</span>
                            </li>
                            <li class="ui-step">
                                <span
                                    ><span class="ui-step-n">3.</span> Publish</span
                                >
                                <span class="ui-badge-muted">pending</span>
                            </li>
                        </ol>
                    </div>

                    <!-- Accordion -->
                    <div class="ui-card">
                        <div class="ui-card-hd">Accordion</div>
                        <div class="p-3 space-y-2">
                            <details class="ui-accordion">
                                <summary class="ui-accordion-summary"
                                    >What is this?</summary
                                >
                                <div class="ui-accordion-body">
                                    原生 details/summary，无 JS。
                                </div>
                            </details>
                            <details class="ui-accordion">
                                <summary class="ui-accordion-summary"
                                    >Constraints</summary
                                >
                                <div class="ui-accordion-body">
                                    无动画、无阴影、灰阶边框。
                                </div>
                            </details>
                        </div>
                    </div>

                    <!-- Dropdown / Modal / Empty / Skeleton / Progress -->
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div class="ui-dropdown p-3">
                            <button class="ui-dropdown-btn">Menu ▼</button>
                            <div class="ui-dropdown-menu">
                                <a
                                    class="ui-dropdown-item ui-dropdown-item-sep"
                                    href="#">Item A</a
                                >
                                <a
                                    class="ui-dropdown-item ui-dropdown-item-sep"
                                    href="#">Item B</a
                                >
                                <a class="ui-dropdown-item" href="#">Item C</a>
                            </div>
                            <div class="ui-help mt-2">静态展示（样式）</div>
                        </div>

                        <div class="ui-modal">
                            <div class="ui-modal-hd">Confirm</div>
                            <div class="ui-modal-bd">
                                Are you sure?
                                <div class="ui-modal-actions">
                                    <button class="ui-btn ui-btn-primary"
                                        >OK</button
                                    >
                                    <button class="ui-btn">Cancel</button>
                                </div>
                            </div>
                        </div>

                        <div class="ui-card">
                            <div class="ui-card-hd">Empty</div>
                            <div class="p-3">
                                <div class="ui-empty">
                                    <div class="ui-empty-title">NO DATA</div>
                                    <div class="ui-empty-text">
                                        Nothing here yet.
                                    </div>
                                    <button class="ui-btn ui-btn-subtle mt-3"
                                        >Create</button
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div class="ui-card">
                            <div class="ui-card-hd">Progress</div>
                            <div class="p-3 space-y-2 text-sm">
                                <div class="ui-progress-meta">
                                    <span class="ui-muted ui-help">Build</span>
                                    <span class="ui-muted ui-help">60%</span>
                                </div>
                                <progress
                                    class="w-full h-3"
                                    value="60"
                                    max="100"
                                ></progress>
                                <div class="ui-help">native & fast</div>
                            </div>
                        </div>

                        <div class="ui-card">
                            <div class="ui-card-hd">Skeleton</div>
                            <div class="p-3 space-y-2">
                                <div class="ui-skeleton h-3 w-2/3"></div>
                                <div class="ui-skeleton h-3 w-full"></div>
                                <div class="ui-skeleton h-3 w-5/6"></div>
                                <div class="ui-skeleton h-8 w-1/2"></div>
                            </div>
                        </div>

                        <div class="ui-card">
                            <div class="ui-card-hd">Tabs (static)</div>
                            <div class="p-3 space-y-3">
                                <div class="ui-tabs">
                                    <button class="ui-tab ui-tab-active"
                                        >Tab A</button
                                    >
                                    <button class="ui-tab">Tab B</button>
                                    <button class="ui-tab">Tab C</button>
                                </div>
                                <div class="ui-tabpanel">
                                    Tab A content（静态）
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Forms -->
            <section id="forms" class="ui-panel">
                <div class="ui-panel-hd">Forms</div>
                <div class="ui-panel-bd space-y-4">
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label class="ui-label">
                            <span class="ui-label-text">Username</span>
                            <input class="ui-input" placeholder="your_name" />
                        </label>
                        <label class="ui-label">
                            <span class="ui-label-text">Select</span>
                            <select class="ui-select">
                                <option>Option A</option>
                                <option>Option B</option>
                                <option>Option C</option>
                            </select>
                        </label>
                    </div>

                    <label class="ui-label">
                        <span class="ui-label-text">Tag input (visual)</span>
                        <div class="ui-tagbox">
                            <span class="ui-tag">tag-a</span>
                            <span class="ui-tag">tag-b</span>
                            <input class="ui-tag-input" placeholder="type..." />
                        </div>
                        <span class="ui-help">只是样式示意</span>
                    </label>

                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label
                            class="flex items-center gap-2 font-mono text-sm"
                        >
                            <input type="checkbox" class="ui-check" />
                            <span>Remember me</span>
                        </label>
                        <div class="flex gap-4 font-mono text-sm">
                            <label class="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="r"
                                    class="ui-radio"
                                    checked
                                />
                                <span>Radio A</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <input type="radio" name="r" class="ui-radio" />
                                <span>Radio B</span>
                            </label>
                        </div>
                    </div>

                    <label class="ui-label">
                        <span class="ui-label-text">Message</span>
                        <textarea
                            class="ui-textarea"
                            rows="4"
                            placeholder="Type..."
                        ></textarea>
                    </label>

                    <div class="flex flex-wrap gap-2">
                        <button class="ui-btn ui-btn-primary">Submit</button>
                        <button class="ui-btn">Cancel</button>
                    </div>
                </div>
            </section>

            <!-- Data -->
            <section id="data" class="ui-panel">
                <div class="ui-panel-hd">Tables & Lists</div>
                <div class="ui-panel-bd space-y-4">
                    <div class="ui-table-wrap">
                        <table class="ui-table">
                            <thead class="ui-thead">
                                <tr class="ui-tr-head">
                                    <th class="ui-th">ID</th>
                                    <th class="ui-th">Name</th>
                                    <th class="ui-th">Status</th>
                                    <th class="ui-th-last">Updated</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
                                <tr class="ui-tr">
                                    <td class="ui-td ui-td-mono">001</td>
                                    <td class="ui-td">Alpha</td>
                                    <td class="ui-td"
                                        ><span class="ui-badge">ok</span></td
                                    >
                                    <td class="ui-td-last ui-td-meta"
                                        >2026-02-12</td
                                    >
                                </tr>
                                <tr class="ui-tr">
                                    <td class="ui-td ui-td-mono">002</td>
                                    <td class="ui-td">Beta</td>
                                    <td class="ui-td"
                                        ><span class="ui-badge-strong"
                                            >hold</span
                                        ></td
                                    >
                                    <td class="ui-td-last ui-td-meta"
                                        >2026-02-01</td
                                    >
                                </tr>
                                <tr>
                                    <td class="ui-td ui-td-mono">003</td>
                                    <td class="ui-td">Gamma</td>
                                    <td class="ui-td"
                                        ><span class="ui-badge-muted"
                                            >unknown</span
                                        ></td
                                    >
                                    <td class="ui-td-last ui-td-meta"
                                        >2025-12-30</td
                                    >
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="ui-list">
                        <a class="ui-list-item ui-list-sep" href="#"
                            >Menu Item 1</a
                        >
                        <a class="ui-list-item ui-list-sep" href="#"
                            >Menu Item 2</a
                        >
                        <a class="ui-list-item" href="#">Menu Item 3</a>
                    </div>

                    <div class="ui-pagination">
                        <a class="ui-pagebtn ui-pagebtn-sep" href="#">Prev</a>
                        <a
                            class="ui-pagebtn ui-pagebtn-sep ui-pagebtn-active"
                            href="#">1</a
                        >
                        <a class="ui-pagebtn ui-pagebtn-sep" href="#">2</a>
                        <a class="ui-pagebtn ui-pagebtn-sep" href="#">3</a>
                        <a class="ui-pagebtn" href="#">Next</a>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="ui-footer">
                <div class="ui-footer-hd">Footer</div>
                <div class="ui-footer-bd">
                    这就是“全部封装版”的基础层：你后续在任何框架（Svelte/React/Vue/Web
                    Components）里， 都只要用这些语义类即可保持统一风格。
                </div>
            </footer>
        </main>
    </div>
</div>
