import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ItemListEmptyStateSvg from '../../assets/img/todo-empty-state.svg'
import './ActivityDetail.css'
import { useDispatch, useSelector } from 'react-redux'
import { toggleItemListDone } from '../../features/itemList/itemListSlice'
import { updateActivity } from '../../features/activity/activitySlice'
import AddItemListModal from '../AddItemListModal/AddItemListModal'

const ActivityDetail = () => {
    const activeActivity = useSelector(state => state.activity.active)
    const itemList = useSelector(state => state.itemList.all).filter(item => item.activityId === activeActivity.id)
    const dispatch = useDispatch()

    const [showAddModal, setShowAddModal] = useState(false)

    const [edit, setEdit] = useState(false)
    const inputRef = useRef(null)

    useEffect(() => {
        document.addEventListener('click', handleClickOutsideInput, true)
        
        return () => document.removeEventListener('click', handleClickOutsideInput, true)
    }, [])

    const handleClickOutsideInput = e => {
        if (inputRef.current !== null && !inputRef.current.contains(e.target)) {
            toggleEdit()
        }
    }

    const toggleEdit = () => {
        setEdit(prev => !prev)
    }

    const onChangeForm = e => {
        dispatch(updateActivity({ id: activeActivity.id, name: e.target.value }))
    }

    return (
        <main>
            <div className='activity-detail-header'>
                <div className='activity-title'>
                    <Link to="/"><span className='back'></span></Link>
                    {edit
                        ? <>
                            <input type="text" value={activeActivity.name} onChange={onChangeForm} ref={inputRef} />
                        </>
                        : <>
                            <h1 className='activity-detail-name' onClick={toggleEdit}>{activeActivity.name}</h1>
                            <span className='edit' onClick={toggleEdit}></span>
                        </>
                    }
                </div>

                <div className='item-list-option'>
                    {itemList.length !== 0 && <span className='sort'></span>}
                    <button onClick={() => setShowAddModal(true)}><span className='plus'></span> Tambah</button>
                </div>
            </div>

            <div className='item-list-container'>
                {itemList.length
                    ? itemList.map((item, i) => <div className='item-list'>
                        <div className='item-list-edit'>
                            <input type="checkbox" className='done' checked={item.done ? true : false} onClick={() => dispatch(toggleItemListDone({ id: item.id }))}/>
                            <span className={'priority-indicator ' + item.priorityIndicator}></span>
                            <h1 className={item.done ? 'line-through' : ''}>{item.name}</h1>
                            <span className="edit"></span>
                        </div>
                        <span className="trash"></span>
                    </div>)
                    : <div className='item-list-empty-state'>
                        <img src={ItemListEmptyStateSvg} onClick={() => setShowAddModal(true)} alt="Item List Empty" />
                    </div>
                }
            </div>

            <AddItemListModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                activityId={activeActivity.id}
            />
        </main>
    )
}

export default ActivityDetail