<?php

declare(strict_types=1);

namespace Kmi\Typo3TodoList\Domain\Model;

use SourceBroker\T3api\Annotation\ApiResource;
use TYPO3\CMS\Extbase\Annotation\Validate;
use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

/**
 * @ApiResource(
 *     collectionOperations={
 *         "get": {
 *             "path": "/tasks",
 *         },
 *         "post": {
 *             "path": "/tasks",
 *             "method": "POST",
 *         },
 *     },
 *     itemOperations={
 *         "get": {
 *             "path": "/tasks/{id}",
 *         },
 *         "patch": {
 *             "path": "/tasks/{id}",
 *             "method": "PATCH",
 *         },
 *         "delete": {
 *             "path": "/tasks/{id}",
 *             "method": "DELETE",
 *         }
 *     },
 *     attributes={
 *         "persistence": {
 *             "storagePid"="2",
 *              "recursive"=1
 *         }
 *     }
 * )
 */
class Task extends AbstractEntity
{
    #[Validate([
        'validator' => 'StringLength',
        'options' => ['minimum' => 1, 'maximum' => 255],
    ])]
    protected string $title = '';
    protected string $description = '';
    protected ?\DateTime $dueDate = null;
    protected bool $completed = false;

    /**
     * @var int|null
     * Workaround, because of the following error:
     * Expected argument of type \"int\", \"null\" given at property path \"pid\".
     * Why is the property metadata not checking that the type is nullable?
     */
    protected ?int $pid = 2;

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
