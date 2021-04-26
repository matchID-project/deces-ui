{#if (result) && !(result.error) }
    <div class="{(expand || fullwidth) ? "rf-col-12" : "rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-6 rf-col-xl-6"} {nomargin ? "" : "rf-padding-1N rf-padding-left-2N rf-padding-right-2N"}">
        <div class="rf-container-fluid">
            <div class="rf-grid-row">
                <div class="rf-col-12">
                    <div
                        class="rf-card rf-card--horizontal rf-card--{expand ? "md": "sm"}"
                        class:rf-card--left-arrow={expand}
                        on:click|preventDefault={toggleExpand}
                    >
                        <div class="rf-card__img" style="position:relative">
                            {#if (wikimediaImgSrc)}
                                <img
                                    class:rf-hide={!wikimediaImgLoaded}
                                    alt={ wikimediaImgSrc }
                                    bind:this={ wikimediaImg }
                                />
                            {/if}
                            <img
                                class="rf-background--{result.links ? 'bf' : 'g400'}"
                                class:rf-hide={wikimediaImgLoaded}
                                alt={ result.sex }
                                src={ result.sex === 'M' ? '/male.svg' : '/female.svg' }
                            />
                            {#if result.correction || ($alphaFeatures && result.modifications && modificationsValidated && !editListMode)}
                                <div
                                    style="position:absolute;top:{expand ? '14' : '6'}px;left:{expand ? '14' : '6'}px"
                                    title="erreur de donnée signalée"
                                >
                                    <Icon icon='ri:alert-line' class="rf-color--rm rf-fi--{expand ? "xxl" : "xl"} rf-margin-left-4px"/>
                                </div>
                            {/if}
                        </div>
                        <div
                            class="rf-card__body"
                            style={(expand && !(result.links && result.links.label)) ? "" : ""}
                        >
                            <a
                                href="#{index}"
                                aria-label="étendre la carte de {result.name.last.toUpperCase()} { result.name.first ? result.name.first.join(' ') : '' }"
                            >
                                <h4
                                    class="rf-card_lead rf-margin-0 {expand ? "" : "rf-text"}"
                                    style="overflow: hidden; text-overflow:ellipsis; {expand ? "" : "height: 1.5rem;"}"
                                >
                                    {result.name.last.toUpperCase()} { result.name.first ? result.name.first.join(' ') : '' }
                                </h4>
                                <p class="rf-card__desc rf-margin-0" style="display: inline;">
                                    <span class="{expand ? "" : "rf-text--xs"}">
                                        {#if ((result.links && result.links.label))}
                                            <strong>
                                                {(expand || (result.links.label.length < 40)) ?
                                                    result.links.label : result.links.label.substring(0,40) + ' ...'
                                                }
                                            </strong>
                                            {expand ? '(source: wikidata.org)' : ''}
                                            {#if expand} <br> {:else} - {/if}
                                        {/if}
                                        {#if (expand || !(result.links && result.links.label))}
                                            <span class="rf-hide--mobile">
                                                { cityString(result.birth.location.city, false) }
                                            </span>
                                        {/if}
                                        { dateStringify(result.birth.date, !expand) }
                                        {#if result.death}
                                            -
                                            {#if (expand || !(result.links && result.links.label))}
                                                <span class="rf-hide--mobile">
                                                    { cityString(result.death.location.city, false) }
                                                </span>
                                            {/if}
                                            { dateStringify(result.death.date, !expand) }
                                        {/if}
                                    </span>
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
                {#if expand}
                    <div class="rf-col-12" transition:slide|local>
                        <div class="rf-callout rf-background--white">
                            {#if result.correction}
                                <span style="display:flex" class="rf-color--rm">
                                    <Icon icon='ri:alert-line' class="rf-color--rm rf-fi--md rf-margin-right-1N" title="erreur de donnée signalée"/>
                                    La fiche a fait l'objet d'un signalement pour erreur.
                                    {#if result.correction.change === "cancel"}
                                        La personne mentionnée n'est pas décédée, et a demandé le retrait de cette fiche au fichier INSEE.
                                    {/if}
                                </span>
                            {/if}
                            <span class="rf-top-right-6px">
                                {#if $route.path === '/search'}
                                    <a
                                        class="rf-text--sm rf-link rf-fi-- rf-href rf-text--right"
                                        title="afficher le lien permanent"
                                        href="/id/{result.id}"
                                    >
                                            <Icon icon='ri:link' class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                            {linkCopied ? "Copié !" : "Permalien"}
                                    </a>
                                {:else}
                                    <a
                                        class="rf-text--sm rf-link rf-fi-- rf-href rf-text--right"
                                        title="copier le lien permanent"
                                        on:click|preventDefault={() => copyLink(result)}
                                        href="/id/{result.id}"
                                    >
                                            <Icon icon='ri:link' class="rf-fi--md" href={link(result)} label="copier le lien permanent"/>
                                            {linkCopied ? "Copié !" : "Permalien"}
                                    </a>
                                {/if}
                            </span>
                            <div class="rf-container-fluid">
                                <div class="rf-grid-row">
                                    {#if $alphaFeatures && result.modifications}
                                        {#if (!$admin && !editListMode && (modificationsValidated || modificationsWaiting))}
                                            <div class="rf-col-12 rf-text--center rf-margin-top-0">
                                                <p>
                                                    <strong>
                                                        {#if modificationsValidated}
                                                            Cette fiche a fait l'objet d'un signalement d'erreur.
                                                        {:else if modificationsWaiting}
                                                            Cette fiche a fait l'objet d'un signalement d'erreur, en cours de validation
                                                            par un administrateur.
                                                        {/if}
                                                    </strong>
                                                    {#if modificationsValidated}
                                                        <a
                                                            href={modifications[modificationsCurrent || 0].proof}
                                                            target="_blank"
                                                            class="rf-link"
                                                            on:click|preventDefault={() => $showProof = modifications[modificationsCurrent || 0].proof}
                                                        >
                                                            Preuve associée
                                                        </a>
                                                    {/if}
                                                </p>
                                            </div>
                                        {/if}
                                    {/if}
                                    {#if edit}
                                        <div class="rf-col-12 rf-text--center" transition:slide>
                                            <p>
                                                <strong>
                                                    Vous pouver maintenant éditer les champs ci-dessous :
                                                </strong>
                                            </p>
                                        </div>
                                    {/if}
                                    {#each Object.keys(conf) as column}
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-6 rf-col-lg-6 rf-col-xl-6">
                                            <table class="rf-table rf-table--narrow rf-table--striped">
                                                <thead>
                                                    <tr>
                                                        <th colspan="2" scope="colgroup">{column}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {#each conf[column] as field}
                                                        {#if field.value &&
                                                            (Array.isArray(field.value) ? field.value.some(x => x) : true)}
                                                            <tr>
                                                                <td width="10rem">{ field.label }</td>
                                                                <td
                                                                    on:mouseenter={() => {
                                                                        if (field.update) {
                                                                            editInput[field.update.join()]  = edit;
                                                                        }
                                                                        if (edit) { setEditInputValue(field) };
                                                                    }}
                                                                    on:mouseleave={() => {
                                                                        if (edit) {
                                                                            updateEditValue(field);
                                                                        }
                                                                        if (field.update) {
                                                                            editInput[field.update.join()]  = false;
                                                                        }
                                                                    }}
                                                                    style={((field.editable!==false)&&editInput[field.update.join()] ) ? 'padding:0;' : ''}
                                                                >
                                                                    {#if ((field.editable!==false)&&editInput[field.update.join()] )}
                                                                        <div style="display: inline-flex;width:100%;">
                                                                            {#each field.update as updateField,i}
                                                                                <input
                                                                                    class="rf-input"
                                                                                    id={updateField}
                                                                                    style="height:100%;width:{field.update.length>1 ? '50%':'100%'};outline:none;font-size:inherit;padding: .13em .5em;"
                                                                                    value={editTmpValue[updateField] || ''}
                                                                                    on:input={handleInput}
                                                                                    use:focus
                                                                                >
                                                                            {/each}
                                                                        </div>
                                                                    {:else}
                                                                        {#if editDisplayChange[field.update && field.update.join()]}
                                                                            <span class="rf-color--rm">
                                                                                {@html `<strike>${field.cb ? field.cb(field.value) : field.value}</strike>
                                                                                    ${field.update
                                                                                        .map((updateField,i) => getEditValue(field,i))
                                                                                        .join(' ')}`}
                                                                            </span>
                                                                        {:else}
                                                                            {#if ($alphaFeatures && (modifications && modifications[modificationsCurrent || 0] && field.update && field.update
                                                                                .some(updateField => modifications[modificationsCurrent || 0].fields[updateField])))}
                                                                                <span class="rf-color--rm">
                                                                                    {@html `<strike>${field.cb ? field.cb(field.value) : field.value}</strike>`}
                                                                                    { modificationStringify(field) }
                                                                                </span>
                                                                            {:else}
                                                                                {@html field.cb ? field.cb(field.value) : field.value }
                                                                            {/if}
                                                                        {/if}
                                                                    {/if}
                                                                </td>
                                                            </tr>
                                                        {/if}
                                                    {/each}
                                                </tbody>
                                            </table>
                                        </div>
                                    {/each}
                                    {#if (result.links && Object.keys(result.links).length)}
                                        {#each wikilinks as key}
                                            <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-{wikilinks.length === 2 ? 6 : 12} rf-col-lg-{wikilinks.length === 2 ? 6 : 12} rf-col-xl-{wikilinks.length === 2 ? 6 : 12} rf-text--center rf-padding-top-1N">
                                                <a
                                                    href={result.links[key]}
                                                    title={`lien ${key}`}
                                                    target="_blank"
                                                    class="rf-link"
                                                >
                                                    Voir sur {key}
                                                </a>
                                            </div>
                                        {/each}
                                    {/if}
                                    <div class="rf-col-12 rf-text--center rf-margin-top-2N">
                                        {#if edit && (Object.keys(editValue).length)}
                                            <p>
                                                <strong>
                                                Transmettre un message
                                                </strong> (optionnel)
                                            </p>
                                            <p>
                                                <textarea class="rf-input" maxlength=200 bind:value={editMessage}/>
                                            </p>
                                            <p>
                                                <strong>
                                                    Fournir une pièce justificative
                                                </strong>
                                            </p>
                                            <p>
                                                Pour renforcer la confiance dans votre proposition, un acte de décès est demandé, ou à défaut, un acte de naissance avec mention marginale du décès,
                                                est nécessaire,
                                                {#if editFile && !editFileValidate}
                                                    <span class="rf-color--rm">
                                                    <strong>au format PDF</strong></span>.
                                                {:else}
                                                    au format PDF.
                                                {/if}
                                                Nous acceptons également un lien vers un document public d'un site d'archive départementale.
                                            </p>
                                            {#if !$user}
                                                <p>
                                                    Un courriel est demandé pour enregistrer votre demande. Un mail vous sera envoyé pour
                                                    confirmer votre identité. Il n'en sera fait aucun autre usage.
                                                </p>
                                            {/if}
                                        {/if}
                                    </div>
                                    {#if $alphaFeatures && modificationsHistory}
                                        <p class="rf-text--center">
                                            <strong>
                                                Nous vous remercions pour votre contribution. Vous trouverez ci-dessous
                                                l'historique des événements:
                                            </strong>
                                        </p>
                                        <table class="rf-table rf-table--narrow rf-table--striped">
                                            <col style="width:50%"/>
                                            <col style="width:50%"/>
                                            <thead>
                                                <tr>
                                                    <th>Modification</th>
                                                    <th>Validation</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {#each modificationsHistory as m}
                                                    <tr>
                                                        <td>
                                                            <div style="display:flex">
                                                                <a
                                                                    href={m.proof}
                                                                    class="rf-link rf-href rf-fi-db-line rf-link--icon-left"
                                                                    on:click|preventDefault={() => $showProof = m.proof}
                                                                >
                                                                    <Icon icon="ri:file-line"/>
                                                                </a>
                                                                <div style="display:block">
                                                                    <strong>
                                                                        {#each Object.keys(m.fields) as k}
                                                                            {displayField[k] || k}: {m.fields[k]} <br>
                                                                        {/each}
                                                                    </strong>
                                                                    {m.date.replace(/T.*/,'')}
                                                                    {#if m.author !== $user}
                                                                        (autre utilisateur)
                                                                    {/if}
                                                                    <br>
                                                                    {#if m.message}
                                                                        message: {m.message}
                                                                    {/if}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style="display:flex;align-items:center;">
                                                                {#if m.auth === 0}
                                                                    <Icon icon="ri:time-line" class="rf-color--rm rf-margin-right-1N"/>
                                                                    en attente
                                                                {:else if m.auth > 0}
                                                                    <Icon icon="ri:check-line" class="rf-color--bf rf-margin-right-1N"/>
                                                                    validé
                                                                {:else if m.auth === -1}
                                                                    <Icon icon="ri:refresh-line" class="rf-color--rm rf-margin-right-1N"/>
                                                                    complément demandé
                                                                {:else if m.auth === -2}
                                                                    <Icon icon="ri:close-line" class="rf-color--rm rf-margin-right-1N"/>
                                                                    rejeté
                                                                {/if}
                                                                {#if m.review}
                                                                    <br>
                                                                    {m.review.date.replace(/T.*/,'')}
                                                                    {#if m.review.message}
                                                                    : {m.review.message}
                                                                    {/if}
                                                                {/if}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                {/each}
                                            </tbody>
                                        </table>
                                    {/if}
                                    {#if ($alphaFeatures && $admin && result.modifications)}
                                        <div class="rf-col-12 rf-text--center rf-margin-top-0" transition:fade>
                                            <div class="rf-grid-row" style="justify-content: center;">
                                                <div class="rf-pagination">
                                                    <ul class="rf-pagination__list rf-text--xs">
                                                        {#if modificationsNumber > 1}
                                                            {#each modifications as m, i}
                                                                <li
                                                                    class="rf-href rf-pagination__item rf-pagination__item--from-md"
                                                                    title="modification {i}"
                                                                    on:click|preventDefault={() => {
                                                                        modificationsCurrent = i;
                                                                        blur();
                                                                    }}
                                                                    class:rf-pagination__item--valid={(modificationsCurrent !== i) && (m.auth> 0)}
                                                                    class:rf-pagination__item--reject={(modificationsCurrent !== i) && (m.auth < 0)}
                                                                    class:rf-pagination__item--active={modificationsCurrent === i}
                                                                >
                                                                    <a
                                                                        class="rf-pagination__link"
                                                                        href={i + 1}
                                                                        aria-label="modification {i}"
                                                                    >
                                                                        {i+1}
                                                                    </a>
                                                                </li>
                                                            {/each}
                                                        {/if}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rf-col-12 rf-text--center rf-margin-top-0" transition:fade>
                                            <p>
                                                <strong>
                                                    Cette fiche a fait l'objet de {modificationsNumber} demande de modifications.
                                                    {modificationsValidated} ont déjà été accetpées, {modificationsWaiting} en attente, {modificationsRejected} rejetées.
                                                </strong>
                                            </p>
                                            <p>
                                                <a
                                                    href={modifications[modificationsCurrent || 0].proof}
                                                    target="_blank"
                                                    class="rf-link"
                                                    on:click|preventDefault={() => $showProof = modifications[modificationsCurrent || 0].proof}
                                                >
                                                    Preuve associée
                                                </a>
                                            </p>
                                            <div class="rf-container-fluid">
                                                <div class="rf-grid-row">
                                                    <div class="rf-col-3">
                                                        <RadioButtons
                                                            id={`type-${modificationsCurrent}`}
                                                            title="Type de document"
                                                            labels={["Acte de décès","Acte de naissance","Autre document français"]}
                                                            values={["french death certificate","french birth certificate","other french document"]}
                                                            bind:value={modifications[modificationsCurrent || 0].review.proofType}
                                                        />
                                                    </div>
                                                    <div class="rf-col-3">
                                                        <RadioButtons
                                                            id={`type-2-${modificationsCurrent}`}
                                                            title=""
                                                            labels={["Acte étranger","Pierre tombale","Autre"]}
                                                            values={["foreign document","grave","other"]}
                                                            bind:value={modifications[modificationsCurrent || 0].review.proofType}
                                                        />
                                                    </div>
                                                    <div class="rf-col-3">
                                                        <RadioButtons
                                                            id={`quality-${modificationsCurrent}`}
                                                            title="Qualité du scan"
                                                            labels={["Mauvaise","Bonne"]}
                                                            values={["poor", "good"]}
                                                            bind:value={modifications[modificationsCurrent || 0].review.proofQuality}
                                                        />
                                                    </div>
                                                    <div class="rf-col-3">
                                                        <RadioButtons
                                                            id={`typography-${modificationsCurrent}`}
                                                            title="Typographie"
                                                            labels={["Manuscrit","Dactylographié","Numérique"]}
                                                            values={["manuscript", "typed","numerical"]}
                                                            bind:value={modifications[modificationsCurrent || 0].review.proofScript}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rf-col-12 rf-text--center rf-margin-top-0" transition:fade>
                                            <button
                                                class="rf-btn rf-padding-right-2N"
                                                class:rf-btn--valid={modifications[modificationsCurrent || 0].auth === 1}
                                                class:rf-btn--secondary={modifications[modificationsCurrent || 0].auth !== 1}
                                                on:click|preventDefault={() => {
                                                    modifications[modificationsCurrent || 0].auth = 1;
                                                    blur();
                                                }}
                                            >
                                                    Valider
                                                    &nbsp;
                                                    <Icon
                                                        icon='ri:check-line'
                                                        class="rf-fi--md"
                                                    />
                                            </button>
                                            <button
                                                class="rf-btn rf-padding-right-2N"
                                                class:rf-btn--reject={modifications[modificationsCurrent || 0].auth === -1}
                                                class:rf-btn--secondary={modifications[modificationsCurrent || 0].auth !== -1}
                                                title="Rejeter"
                                                on:click|preventDefault={() => {
                                                    modifications[modificationsCurrent || 0].auth = -1;
                                                    blur();
                                                }}
                                            >
                                                    Rejeter
                                                    &nbsp;
                                                    <Icon
                                                        icon='ri:refresh-line'
                                                        class="rf-fi--md"
                                                    />
                                            </button>
                                            <button
                                                class="rf-btn rf-padding-right-2N"
                                                class:rf-btn--reject={modifications[modificationsCurrent || 0].auth === -2}
                                                class:rf-btn--secondary={modifications[modificationsCurrent || 0].auth !== -2}
                                                title="Clore"
                                                on:click|preventDefault={() => {
                                                    modifications[modificationsCurrent || 0].auth = -2;
                                                    blur();
                                                }}
                                            >
                                                    Clore
                                                    &nbsp;
                                                    <Icon
                                                        icon='ri:close-line'
                                                        class="rf-fi--md"
                                                    />
                                            </button>
                                        </div>
                                        <div class="rf-col-12 rf-text--center" transition:fade>
                                            <p>
                                                <strong>{modifications[modificationsCurrent || 0].author}</strong> &nbsp;
                                                ({modifications[modificationsCurrent || 0].date.replace(/T(..).*/,' $1h')})
                                                {#if modifications[modificationsCurrent || 0].message}
                                                    <br>
                                                    <i>
                                                        {modifications[modificationsCurrent || 0].message}
                                                    </i>
                                                {/if}
                                            </p>
                                            {#if (modifications[modificationsCurrent || 0].auth === -1) &&
                                                !modifications[modificationsCurrent || 0].review.silent
                                            }
                                                <p>
                                                    <strong>
                                                    Transmettre un message
                                                    </strong> (sera inclus dans l'email)
                                                </p>
                                                <textarea
                                                    id={`admin-message-${modificationsCurrent}`}
                                                    name={`admin-message-${modificationsCurrent}`}
                                                    class="rf-input"
                                                    maxlength=200
                                                    bind:value={modifications[modificationsCurrent || 0].review.message
                                                }/>
                                            {/if}
                                            <div class="rf-checkbox-group">
                                                <input
                                                    class="rf-input"
                                                    type="checkbox"
                                                    bind:checked={modifications[modificationsCurrent || 0].review.silent}
                                                    id={`silent-${modificationsCurrent}`}
                                                    name={`silent-${modificationsCurrent}`}/>
                                                <label class="rf-label" for={`silent-${modificationsCurrent}`}>
                                                    Ne pas envoyer de mail
                                                </label>
                                            </div>
                                        </div>
                                        <div class="rf-col-12 rf-text--center" transition:fade>
                                            <button
                                                class="rf-btn rf-padding-right-2N"
                                                title="Transmettre les validations"
                                                on:click|preventDefault={() => {
                                                    const updates = {}
                                                    modifications.forEach(m => {
                                                        const review = {};
                                                        if (m.auth) {
                                                            review.status = (m.auth > 0) ? "validated" :
                                                                    ((m.auth === -1) ? "rejected" : "closed");
                                                        }
                                                        ['proofQuality','proofScript','proofType','silent','message'].forEach(k => {
                                                            if (m.review[k]) {
                                                                review[k] = m.review[k];
                                                            }
                                                        });
                                                        if ((m.auth !== -1) || review.silent) {
                                                            delete review.message;
                                                        }
                                                        if (Object.keys(review).length) {
                                                            updates[m.id] = JSON.stringify(review);
                                                        }
                                                    })
                                                    updateRecord(updates);
                                                }}
                                                disabled={modificationsLastUpdate === JSON.stringify(modifications)}
                                            >
                                                    Transmettre les validations
                                                    &nbsp;
                                                    <Icon
                                                        icon={(editSuccess === true ? 'ri:check-line' :
                                                                (editSuccess === false ? 'ri:alert-line' : 'ri:send-plane-line'))}
                                                        class="rf-fi--md"
                                                        spin={editUpdating}
                                                    />
                                            </button>
                                        </div>
                                    {:else if ($alphaFeatures && !edit)}
                                        <div class="rf-col-12 rf-text--center" transition:fade>
                                            <button
                                                class="rf-btn rf-btn--secondary rf-padding-right-2N"
                                                title={modificationsWaiting ? "Une modification est déjà en attende de validation" : `Proposer une ${editListMode ? 'nouvelle correction' : 'correction'}`}
                                                on:click|preventDefault={toggleEdit}
                                                disabled={modificationsWaiting}
                                            >
                                                    { modificationsWaiting ?
                                                        'Correction en cours de validation' :
                                                        `Proposer une ${editListMode ? 'nouvelle correction' : 'correction'}`
                                                    }
                                                    &nbsp;<Icon icon='ri:edit-line' class="rf-fi--md"/>
                                            </button>
                                        </div>
                                    {:else if $alphaFeatures && (Object.keys(editValue).length)}
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-2" transition:fade></div>
                                        <div class="rf-col-xs-6 rf-col-sm-6 rf-col-md-6 rf-col-lg-6 rf-col-xl-4 rf-padding-bottom-1N" transition:fade>
                                            <div style="padding-left:8px;padding-right:8px;margin-top:-3px;">
                                                <div
                                                    class="rf-input-group"
                                                    class:rf-input-group--valid={editUrl && editUrlValidate}
                                                    class:rf-input-group--error={editUrl && (editUrlValidate===false)}
                                                >
                                                    <label
                                                        class="rf-label rf-text--left"
                                                        for="editUrl"
                                                        style="overflow:hidden;text-overflow:ellipsis;position: relative"
                                                    >
                                                        <span
                                                            class:rf-fi-check-line={editUrl && editUrlValidate}
                                                            class:rf-fi-alert-line={editUrl && (editUrlValidate===false)}
                                                        >
                                                            &nbsp;
                                                        </span>
                                                        <span style="position:absolute;top:-2px">Lien</span>
                                                    </label>
                                                    <input
                                                        id="editUrl"
                                                        class:rf-input--valid={editUrlValidate}
                                                        class="rf-input rf-margin-top-0"
                                                        style="width: 100%; max-width: 240px;"
                                                        bind:value={editUrl}
                                                        on:focus={() => { editUrlValidate = undefined }}
                                                        on:blur={testEditUrl}
                                                        disabled={editFile || editSuccess}
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rf-col-xs-6 rf-col-sm-6 rf-col-md-6 rf-col-lg-6 rf-col-xl-4 rf-text--center" transition:fade>
                                            <button
                                                class="rf-btn rf-btn--secondary rf-padding-right-2N rf-inactive"
                                                style="width: 100%; justify-content: center; max-width: 240px;"
                                                class:rf-inactive={editUrlValidate}
                                                class:rf-color--rm={editFile && !editFileValidate}
                                                title="Charger un fichier au format PDF"
                                                on:click|preventDefault={chooseFile}
                                                disabled={editUrlValidate || editSuccess}
                                            >
                                                    { editFile ?
                                                        ( editFileValidate ? ellipsis(editFile.name) : 'PDF uniquement' )
                                                        : 'Charger un fichier'}
                                                    &nbsp;
                                                    <Icon
                                                        icon={
                                                            editFile ?
                                                                ( editFileValidate ? 'ri:check-line' : 'ri:alert-line' )
                                                                : 'ri:upload-cloud-line'
                                                        }
                                                        class="rf-fi--md"
                                                    />
                                            </button>
                                        </div>
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-2" transition:fade></div>
                                        <div class="rf-col-12 rf-margin-top-1N" transition:fade></div>
                                        <div class="rf-col-xs-12 rf-col-sm-12 rf-col-md-12 rf-col-lg-12 rf-col-xl-2" transition:fade></div>
                                        <div class="rf-col-xs-6 rf-col-sm-6 rf-col-md-6 rf-col-lg-6 rf-col-xl-4" transition:fade>
                                            <div style="padding-left:8px;padding-right:8px;margin-top:-3px;">
                                                {#if (!editMailSent || $user)}
                                                    <div
                                                        class="rf-input-group"
                                                        class:rf-input-group--valid={editMail && editMailSent}
                                                        class:rf-input-group--error={editMailSent===false}
                                                    >
                                                        <label
                                                            class="rf-label rf-text--left"
                                                            for="editMail"
                                                            style="overflow:hidden;text-overflow:ellipsis;position: relative"
                                                        >
                                                            Courriel
                                                        </label>
                                                        <input
                                                            id="editMail"
                                                            type="email"
                                                            class:rf-input--valid={editMailSent}
                                                            class="rf-input rf-margin-top-0"
                                                            style="width: 100%; max-width: 240px;"
                                                            bind:value={editMail}
                                                            on:input={() => editMailSent = undefined}
                                                            on:focus={() => {
                                                                editMail = undefined;
                                                                editMailSent = undefined;
                                                            }}
                                                            on:blur={register}
                                                            disabled={$user}
                                                        >
                                                        {#if ($user)}
                                                            <p class="rf-valid-text">
                                                                Vous êtes identifié(e)<br>
                                                            </p>
                                                        {:else}
                                                            <p class="rf-text--xs" style="margin-top:.5rem">
                                                                Un code d'accès sera envoyé à cette<br>
                                                                adresse pour valider votre identité
                                                            </p>
                                                        {/if}
                                                    </div>
                                                {:else}
                                                    <div
                                                        class="rf-input-group"
                                                        class:rf-input-group--valid={editMail && editMailValidate}
                                                        class:rf-input-group--error={editMailValidate===false}
                                                    >
                                                        <label
                                                            class="rf-label rf-text--left"
                                                            for="editMailOTP"
                                                            style="overflow:hidden;text-overflow:ellipsis;position: relative"
                                                        >
                                                            Code de validation
                                                        </label>
                                                        <input
                                                            id="editMailOTP"
                                                            type="text"
                                                            maxlength="6"
                                                            class:rf-input--valid={editUrlValidate}
                                                            class="rf-input rf-margin-top-0"
                                                            style="width: 100%; max-width: 240px;"
                                                            bind:value={editMailOTP}
                                                            on:input={() => {
                                                                editMailOTP = editMailOTP.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                                                                editMailValidate = undefined;
                                                                login();
                                                            }}
                                                            on:focus={() => {
                                                                editMailOTP = '';
                                                                editMailValidate = undefined;
                                                            }}
                                                            on:blur={login}
                                                        >
                                                        {#if (!editMailOTP)}
                                                            <p class="rf-valid-text">
                                                                Un code vous a été envoyé à l'adresse<br>
                                                                indiquée pour valider votre identité
                                                            </p>
                                                        {:else if (editMailValidate === false)}
                                                            <p class="rf-error-text">
                                                                Le code d'accès n'est pas valide<br>
                                                                Veuillez réessayer
                                                            </p>
                                                        {/if}
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="rf-col-xs-6 rf-col-sm-6 rf-col-md-6 rf-col-lg-6 rf-col-xl-4 rf-text--center" transition:fade>
                                            <button
                                                class="rf-btn rf-padding-right-2N"
                                                style="width: 100%; justify-content: center; max-width: 240px;"
                                                title={editValidate ? 'Transmettre' : 'Annuler'}
                                                on:click={() => {
                                                    if (editValidate) {
                                                        updateRecord(editValue);
                                                    }
                                                    else {
                                                        toggleEdit();
                                                        if (!$user) {
                                                            editMail = ''
                                                            editMailSent = undefined;
                                                        }
                                                        editValue = {};
                                                        editDisplayChange = {};
                                                    }
                                                }}
                                                disabled={editSuccess}
                                            >
                                                    {editValidate ? 'Transmettre' : 'Annuler'}
                                                    &nbsp;
                                                    <Icon
                                                        icon={editValidate ?
                                                            (editSuccess === true ? 'ri:check-line' :
                                                                (editSuccess === false ? 'ri:alert-line' : 'ri:send-plane-line')) : 'ri:close-line'}
                                                        class="rf-fi--md"
                                                        spin={editUpdating}
                                                    />
                                            </button>
                                        </div>
                                    {/if}
                                    {#if editSuccess && !$admin}
                                        <div class="rf-col-12 rf-text--center" transition:fade>
                                            <p>
                                                <strong>
                                                    Merci !
                                                </strong>
                                            </p>
                                            <p>
                                                Votre suggestion doit être examinée par un
                                                administrateur, vous recevrez ensuite un message de confirmation.
                                            </p>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}


<script>
    import { onMount } from 'svelte';
    import getDataGouvCatalog from '../tools/getDataGouvCatalog.js';
    import { fade, slide } from 'svelte/transition';
    import { showProof, admin, user, accessToken, alphaFeatures, route, dataGouvCatalog, displayMode, searchInput, activeElement } from '../tools/stores.js';
    import Icon from './Icon.svelte';
    import RadioButtons from './RadioButtons.svelte';
    import { capitalize,
        lastNameEditMask, lastNameStringify, lastNameParse,
        firstNameEditMask, firstNameStringify, firstNameParse,
        sexEditMask, sexStringify, sexParse,
        dateEditMask, dateStringify, dateParse,
        cityEditMask, countryEditMask, locationCodeEditMask,
        departmentCodeEditMask, countryCodeEditMask
    } from '../tools/masks.js';

    onMount(async () => { getDataGouvCatalog() });

    import md5 from 'md5';
    import axios from 'axios';
    export let fullwidth = false;
    export let nomargin = false;
    export let onclick = () => {};

    export let result  = undefined;
    export let index = undefined;
    export let forceExpand = undefined;
    let linkCopied = false;
    let wikilinks;
    let wikimediaImgSrc;
    let wikimediaImg;
    let wikimediaImgLoaded;
    export let editListMode = false;
    let edit = false;
    let editInput = {};
    let editTmpValue = {};
    let editMessage = '';
    let editValue = {};
    let editDisplayChange = {};
    let editFile;
    let editFileValidate;
    let editUrl;
    let editUrlValidate;
    let editMail;
    let editMailSent;
    let editMailOTP;
    let editMailValidate;
    let editValidate;
    let editUpdating;
    let editSuccess;
    let modifications = [];
    let modificationsCurrent;
    let modificationsRejected;
    let modificationsValidated;
    let modificationsWaiting;
    let modificationsNumber;
    let modificationsHistory;
    let modificationsLastUpdate;
    let expand = forceExpand || ($displayMode === 'card-expand');

    const blur = () => {
        activeElement.update(v => {
            v && v.blur();
            return undefined;
        });
    }

    const masks = {
        sex: sexEditMask,
        firstName: firstNameEditMask,
        lastName: lastNameEditMask,
        birthDate: dateEditMask,
        birthCity: cityEditMask,
        birthCountry: countryEditMask,
        birthLocationCode: locationCodeEditMask,
        birthDepartment: departmentCodeEditMask,
        birthCountryCode: countryCodeEditMask,
        deathDate: dateEditMask,
        deathCity: cityEditMask,
        deathCountry: countryEditMask,
        deathLocationCode: locationCodeEditMask,
        deathDepartment: departmentCodeEditMask,
        deathCountryCode: countryCodeEditMask,
    }

    const handleInput = (e) => {
        if (masks[e.target.id]) {
            e.target.value = masks[e.target.id](e.target.value, editTmpValue[e.target.id]);
            editTmpValue[e.target.id] = e.target.value;
        } else {
            editTmpValue[e.target.id] = e.target.value;
        }
    };

    const validateFileType = () => {
        if (editFile) {
            const filereader = new FileReader()

            filereader.onloadend = function(evt) {
                if (evt.target.readyState === FileReader.DONE) {
                    const uint = new Uint8Array(evt.target.result)
                    let bytes = []
                    uint.forEach((byte) => {
                        bytes.push(byte.toString(16))
                    })
                    const hex = bytes.join('').toUpperCase()
                    if (hex === '25504446') {
                        editFileValidate = true
                    } else {
                        editFileValidate = false;
                    }
                }
            }

            const blob = editFile.slice(0, 4);
            filereader.readAsArrayBuffer(blob);
        }
    }

    $: editFile && validateFileType();

    const setModificationStates = () =>  {
        if (result.modifications) {
            modificationsNumber = result.modifications.length;
            modificationsValidated = result.modifications.filter(m => m.auth > 0).length;
            modificationsRejected = result.modifications.filter(m => m.auth < 0).length;
            modificationsWaiting = result.modifications.filter(m => m.auth === 0).length;
            if ($admin) {
                modifications = result.modifications.slice().map(m => {
                    const mm = {};
                    Object.keys(m).forEach(k => mm[k] = m[k]);
                    if (!/https?:/.test(m.proof)) {
                        mm.proof = `__BACKEND_PROXY_PATH__/updates/proof/${result.id}-${m.id}`;
                    }
                    mm.review = {};
                    if (m.review) {
                        Object.keys(m.review).forEach(k => mm.review[k] = m.review[k]);
                        if (!mm.review.message) {
                            mm.review.message = '';
                        }
                    }
                    mm.fields = {};
                    if (m.fields) {
                        Object.keys(m.fields).forEach(k => mm.fields[k] = m.fields[k]);
                    }
                    return mm;
                });
                let modificationsNumberLastUpdated;
                result.modifications.slice().reverse().forEach((m, i) => {
                    if (m.auth === 0) { modificationsNumberLastUpdated = modificationsNumber - i - 1; }
                });
                if (modificationsCurrent === undefined) {
                    modificationsCurrent = modificationsNumberLastUpdated || modificationsNumber - 1;
                }
            } else {
                // for enduser consolidate sum of every validated modif
                const fields = {};
                let proof;
                let history
                if (result.modifications.some(m => m.author === $user)) {
                    history = [];
                }
                result.modifications
                    .forEach(m => {
                        if (m.auth>0) {
                            Object.keys(m.fields).forEach(k => fields[k] = m.fields[k]);
                            if (/https?:/.test(m.proof)) {
                                proof = m.proof
                            } else {
                                proof = `__BACKEND_PROXY_PATH__/updates/proof/${result.id}-${m.id}`;
                            }
                        }
                        if (history) {
                            if (!/https?:/.test(m.proof)) {
                                m.proof = `__BACKEND_PROXY_PATH__/updates/proof/${result.id}-${m.id}`;
                            }
                            if (m.author !== $user) {
                                delete m.message;
                                if (m.review) {
                                    delete m.review.message;
                                }
                            }
                            history.push(m);
                        }
                    });
                modifications = [{fields: fields, proof: proof}];
                if (history) {
                    modificationsHistory = history;
                }
                modificationsCurrent = 0;
            }
        } else {
            modificationsWaiting = undefined;
            modifications = undefined;
        }
        modificationsLastUpdate = JSON.stringify(modifications);
    }

    $: if (result) { setModificationStates() };

    $: if ($user) { editMail = $user;}

    const register = () => {
        if (/^\S+\@\S+\.\S+$/.test(editMail)) {
            if (!$user) {
                fetch('__BACKEND_PROXY_PATH__/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: editMail })
                }).then((response) => {
                    if (response.status === 422) {
                        editMailSent = false
                        return;
                    }
                    return response.json().then((json) => {
                        editMailSent = true
                    });
                })
            } else {
                editMailValidate = true;
            }
        } else {
            editMailSent = false;
        }
    }

    const login = () => {
        if (/^\d{6}$/.test(`${editMailOTP}`)) {
            if (!$user) {
                fetch('__BACKEND_PROXY_PATH__/auth', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: editMail, password: `${editMailOTP}` })
                }).then((response) => {
                    if (response.status === 401) {
                        editMailValidate = false
                        $user = undefined;
                        $accessToken = undefined;
                        return;
                    }
                    return response.json().then((json) => {
                        $accessToken = json.access_token;
                        $user = editMail;
                        editMailOTP = '';
                        editMailValidate = true
                    });
                })
            } else {
                editMailValidate = true;
            }
        } else {
            editMailValidate = undefined;
        }
    }

    $: expand = forceExpand || ($displayMode === 'card-expand');

    $: editMailValidate = $user;

    $: editValidate = ((editFileValidate || editUrlValidate) && (Object.keys(editValue).length));

    const getEditValue = (field, i) => {
        const edited = editValue[field.update[i]];
        if (edited) {
            return field.updateCb ? field.updateCb[i].in(edited) : edited;
        } else {
            return defaultEditValue(field, i);
        }
    };

    const defaultEditValue = (field, i) => {
        if (field.update.length>1) {
            return field.updateCb ? field.updateCb[i].in(field.value[i]) : field.value[i];
        } else {
            return field.updateCb ? field.updateCb[i].in(field.value) : field.value;
        }
    };

    const setEditInputValue = (field) => {
        field.update.forEach((updateField,i) => {
            editTmpValue[updateField] = getEditValue(field,i);
        });
    }

    const updateEditValue = (field) => {
        field.update.forEach((updateField,i) => {
            if (editTmpValue[updateField] === defaultEditValue(field,i)) {
                delete editValue[updateField];
            } else {
                editValue[updateField] = field.updateCb ? field.updateCb[i].out(editTmpValue[updateField]) : editTmpValue[updateField];
            }
        });
        editDisplayChange[field.update.join()] = (field.update && field.update
            .some((updateField,i) =>
                    editValue[updateField] &&
                    (editValue[updateField] !== defaultEditValue(field, i))
                ));
    }

    const updateRecord = async (inputValues) => {
        const formData = new FormData();
        Object.keys(inputValues).forEach(field => {
            formData.append(field, inputValues[field])
        });
        if (!$admin) {
            if (editMessage) {
                formData.append('message', editMessage);
            }
            if (editFile) {
                formData.append('proof', editFile);
            } else {
                formData.append('proof', editUrl);
            }
        }
        editUpdating = true;
        try {
            const res = await axios.post(`__BACKEND_PROXY_PATH__/id/${result.id}`,
                formData,
                {headers: {Authorization: `Bearer ${$accessToken}`}});
            editUpdating = false;
            editSuccess = true;
            modificationsLastUpdate = JSON.stringify(modifications);
        } catch(e) {
            editUpdating = false;
            editSuccess = false;
        }
    }

    const modificationStringify = (field) => {
        let value = field.update.map((updateField,i) =>
            modifications[modificationsCurrent || 0].fields[updateField] ?
                modifications[modificationsCurrent || 0].fields[updateField] : field.value[i]
        );
        if (field.update.length === 1) {
            value = value[0];
        }
        return field.cb ? field.cb(value) : value;
    }

    const testEditUrl = async () => {
        if (!/https?:\/\/\S+\.\S+/.test(editUrl)) {
            editUrlValidate = false;
            return
        }
        try {
            const response = await fetch(editUrl, { mode: 'cors' });
            if (response.status>=400) { throw(response); }
            editUrlValidate = true;
        } catch(e) {
            editUrlValidate = false;
        }
    }

    const chooseFile = () => {
        if (editUrl) {return}
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = ev => {
            editFile = ev.target.files[0];
        }
        blur();
        input.click();
    }

    const focus = (el) => {
        el.focus();
    }

    const ellipsis = (s) => {
        if (s.length < 16) { return s }
        return `${s.substring(0,7)}...${s.substring(s.length-7,s.length)}`;
    }

    const wikimediaThumbUrl = (img) => {
        try {
            const imgName = decodeURIComponent(img).replace(/^.*\//,'').replace(/ /g,'_');
            const md = md5(imgName);
            return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md[0]}/${md.substring(0,2)}/${imgName}/80px-${imgName}`
        } catch(e) {
            return img;
        }
    }

    $: wikimediaImgSrc = result.links && wikimediaThumbUrl(result.links.wikimedia);

    $: if (wikimediaImg && wikimediaImgSrc) {
        wikimediaImgLoaded = false;
        wikimediaImg.src = wikimediaImgSrc;
        wikimediaImg.onload = () => { wikimediaImgLoaded = true }
    }

    let conf = {};

    const displayField = {
        lastName: 'Nom',
        firstName: 'Prénom(s)',
        sex: 'Sexe',
        birthDate: 'Date de naissance',
        birthCity: 'Commune de naissance',
        birthCountry: 'Pays de naissance',
        birthLocationCode: 'Code lieu de naissance',
        deathDate: 'Date de naissance',
        deathCity: 'Commune de naissance',
        deathCountry: 'Pays de naissance',
        deathLocationCode: 'Code lieu de naissance',
    }

    $: conf.Naissance = [
            { label: 'Nom', value: result.name.last, update: ['lastName'] },
            { label: 'Prénom(s)', value: result.name.first, cb: firstNameStringify, update: ['firstName'], updateCb: [{in: firstNameStringify, out: firstNameParse}] },
            { label: 'Sexe', value: result.sex, cb: sexStringify, update: ['sex'], updateCb: [{in: sexStringify, out: sexParse}] },
            { label: 'Date', value: result.birth.date, cb: dateStringify, update: ['birthDate'], updateCb: [{in: dateStringify, out: dateParse}]},
            { label: 'Commune',  value: [result.birth.location.city, result.birth.location.code], cb: (c) => `${cityString(c[0],true)} (${c[1]})`, update: ['birthCity','birthLocationCode'],
                updateCb: [{in: c => Array.isArray(c) ? c[0] : c, out: c => c},{in: c => c, out: c => c}]},
            { label: 'Département',  value: result.birth.location.departmentCode, update: ['birthDepartment'] },
            { label: 'Pays',  value: [ result.birth.location.country, result.birth.location.countryCode], cb: (c) => `${c[0]}${c[1] ? ` (${c[1]})` : ''}`, update: ['birthCountry', 'birthCountryCode']}
        ];
    $: if (result.death) {
        conf['Décès'] = [
            { label: 'Date',  value: result.death.date, cb: dateStringify, update: ['deathDate'], updateCb: [{in: dateStringify, out: dateParse}]},
            { label: 'Age',  editable: false, value: result.death.age, cb: (a) => `${a} ans`},
            { label: 'Commune',  value: [result.death.location.city, result.death.location.code], cb: (c) => `${cityString(c[0],true)} (${c[1]})`, update: ['deathCity','deathLocationCode'],
                updateCb: [{in: c => Array.isArray(c) ? c[0] : c, out: c => c},{in: c => c, out: c => c}]},
            { label: 'Département',  value: result.death.location.departmentCode, update: ['deathDepartment'] },
            { label: 'Pays',  value: [result.death.location.country, result.death.location.countryCode], cb: (c) => `${c[0]}${c[1] ? ` (${c[1]})` : ''}`, update: ['deathCountry','deathCountryCode']},
            { label: 'Acte n°',  editable: false, value: result.death.certificateId, },
            { label: 'Source INSEE', editable: false, value: $dataGouvCatalog && [result.source, result.sourceLine], cb: (s) => `<a href=${$dataGouvCatalog[s[0]]} title="source INSEE ${s[0]}" target="_blank">fichier ${s[0]}</a>, ligne n°${s[1]}` }
        ]
    } else {
        conf['Décès'] && delete conf['Décès'];
    };

    const toggleEdit = () => {
        edit = !edit;
        blur();
    }

    const toggleExpand = () => {
        expand = !expand;
        onclick();
        blur();
    }

    const link = (result) => {
        return `${location.origin}/id/${result.id}`;
    }

    const copyLink = (result) => {
        navigator.clipboard.writeText(link(result));
        linkCopied = true;
        blur();
        setTimeout(() => linkCopied = false, 5000)
    }

    const toDate = (dateString) => {
        return new Date(
            dateString.substring(0,4),
            dateString.substring(4,6) - 1,
            dateString.substring(6,8)
        );
    };

    const cityString = (city, full) => {
        return city
            ? ( Array.isArray(city)
                ? (city.some(x => full ? x.match(/arrondissement/i) : !x.match(/arrondissement/i))
                    ? city.filter(x => full ? x.match(/arrondissement/i) : !x.match(/arrondissement/i))[0]
                    : city[0])
                : city)
            : ''
    };

    $: if (result.links) {
        wikilinks = Object.keys(result.links).filter(x => ['wikipedia','wikidata'].includes(x))
    };

</script>

<style>


</style>
