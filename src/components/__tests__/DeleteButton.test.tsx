import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DeleteButton } from '../DeleteButton'

global.fetch = jest.fn()

describe('DeleteButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.confirm = jest.fn()
  })

  it('should render delete button', () => {
    render(<DeleteButton endpoint="/api/test/1" redirectPath="/test" />)
    
    const button = screen.getByRole('button', { name: /delete/i })
    expect(button).toBeInTheDocument()
  })

  it('should show confirmation dialog when clicked', () => {
    global.confirm = jest.fn(() => false)
    
    render(<DeleteButton endpoint="/api/test/1" redirectPath="/test" />)
    const button = screen.getByRole('button', { name: /delete/i })
    
    fireEvent.click(button)
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this item? This action cannot be undone.')
  })

  it('should not delete if user cancels confirmation', () => {
    global.confirm = jest.fn(() => false)
    
    render(<DeleteButton endpoint="/api/test/1" redirectPath="/test" />)
    const button = screen.getByRole('button', { name: /delete/i })
    
    fireEvent.click(button)
    
    expect(fetch).not.toHaveBeenCalled()
  })

  it('should call API when user confirms', async () => {
    global.confirm = jest.fn(() => true)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })
    
    render(<DeleteButton endpoint="/api/test/1" redirectPath="/test" />)
    const button = screen.getByRole('button', { name: /delete/i })
    
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/test/1', {
        method: 'DELETE',
      })
    })
  })

  it('should handle API errors gracefully', async () => {
    global.confirm = jest.fn(() => true)
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    
    render(<DeleteButton endpoint="/api/test/1" redirectPath="/test" />)
    const button = screen.getByRole('button', { name: /delete/i })
    
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })
    
    consoleError.mockRestore()
  })

  it('should disable button while deleting', async () => {
    global.confirm = jest.fn(() => true)
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    )
    
    render(<DeleteButton endpoint="/api/test/1" redirectPath="/test" />)
    const button = screen.getByRole('button', { name: /delete/i })
    
    fireEvent.click(button)
    
    expect(button).toBeDisabled()
  })
})


