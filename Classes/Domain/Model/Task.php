<?php

declare(strict_types=1);

namespace Kmi\Typo3TodoList\Domain\Model;

use SourceBroker\T3api\Annotation as T3api;
use TYPO3\CMS\Extbase\Annotation\Validate;
use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

/**
 * @T3api\ApiResource(
 *     collectionOperations={
 *         "get": {
 *             "method": "GET",
 *             "path": "/tasks",
 *             "normalizationContext": {
 *                 "groups": {"api_item_task"}
 *             },
 *         },
 *         "post": {
 *             "path": "/tasks",
 *             "method": "POST",
 *             "normalizationContext": {
 *                 "groups": {"api_item_task"}
 *             },
 *         },
 *     },
 *     itemOperations={
 *         "get": {
 *             "method": "GET",
 *             "path": "/tasks/{id}",
 *             "normalizationContext": {
 *                 "groups": {"api_item_task"}
 *             },
 *         },
 *         "patch": {
 *             "path": "/tasks/{id}",
 *             "method": "PATCH",
 *             "normalizationContext": {
 *                 "groups": {"api_item_task"}
 *             },
 *         },
 *         "delete": {
 *             "path": "/tasks/{id}",
 *             "method": "DELETE",
 *             "normalizationContext": {
 *                 "groups": {"api_item_task"}
 *             },
 *         }
 *     },
 *     attributes={
 *         "persistence": {
 *             "storagePid": "2",
 *             "recursive": 1
 *         }
 *     }
 * )
 */
class Task extends AbstractEntity
{
    /**
     * @T3api\Serializer\Groups({
     *     "api_item_task",
     * })
     * */
    #[Validate([
        'validator' => 'StringLength',
        'options' => ['minimum' => 1, 'maximum' => 255],
    ])]
    protected string $title = '';

    /**
     * @T3api\Serializer\Groups({
     *     "api_item_task",
     * })
     * */
    protected string $description = '';

    /**
     * @T3api\Serializer\Groups({
     *     "api_item_task",
     * })
     * */
    protected ?\DateTime $dueDate = null;

    /**
     * @T3api\Serializer\Groups({
     *     "api_item_task",
     * })
     * */
    protected bool $completed = false;

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    public function getDueDate(): ?\DateTime
    {
        return $this->dueDate;
    }

    public function setDueDate(?\DateTime $dueDate): void
    {
        $this->dueDate = $dueDate;
    }

    public function isCompleted(): bool
    {
        return $this->completed;
    }

    public function setCompleted(bool $completed): void
    {
        $this->completed = $completed;
    }
}
